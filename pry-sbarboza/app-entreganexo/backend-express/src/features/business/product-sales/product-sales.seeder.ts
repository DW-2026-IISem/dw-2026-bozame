import { faker } from "@faker-js/faker";
import { sequelize } from "../../../database/db";
import { ProductSale } from "./product-sale.model";
import { Sale } from "../sales/sale.model";
import { Product } from "../products/product.model";

/**
 * Seeder del feature ProductSale (tabla `product_sales`).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere ventas y productos activos. Idempotente: si ya hay filas, omite.
 * Recalcula subtotal/total de cada venta afectada y reduce stock.
 */
export async function seedProductSales(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  product_sales: count=0, se omite");
    return 0;
  }

  const existing = await ProductSale.count();
  if (existing > 0) {
    console.log(`⏭️  product_sales: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const sales = await Sale.findAll({ where: { status: "active" } });
  const products = await Product.findAll({ where: { status: "active" } });

  if (sales.length === 0 || products.length === 0) {
    console.log("⏭️  product_sales: faltan ventas o productos activos, se omite seeder");
    return 0;
  }

  let created = 0;
  let saleIndex = 0;

  while (created < count && saleIndex < sales.length * 3) {
    const sale = sales[saleIndex % sales.length];
    saleIndex += 1;

    const t = await sequelize.transaction();
    try {
      const product = products[Math.floor(Math.random() * products.length)];
      const fresh = await Product.findByPk(product.id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!fresh || fresh.quantity < 1) {
        await t.rollback();
        continue;
      }

      const quantity = Math.min(
        fresh.quantity,
        faker.number.int({ min: 1, max: Math.min(3, fresh.quantity) })
      );
      const unit_price = Number(fresh.price);
      const line_total = unit_price * quantity;

      await ProductSale.create(
        {
          sale_id: sale.id,
          product_id: fresh.id,
          quantity,
          unit_price,
          line_total,
          status: "active",
        },
        { transaction: t }
      );

      await fresh.update(
        { quantity: fresh.quantity - quantity },
        { transaction: t }
      );

      // El seeder escribe directo en la BD (no pasa por el controller/service), así que
      // replica la regla de `recalculateSaleTotals`: subtotal de líneas activas y
      // total = subtotal + tax - discounts.
      const items = await ProductSale.findAll({
        where: { sale_id: sale.id, status: "active" },
        transaction: t,
      });
      const subtotal = items.reduce((sum, row) => sum + Number(row.line_total), 0);
      const saleRow = await Sale.findByPk(sale.id, { transaction: t });
      if (saleRow) {
        const total = subtotal + Number(saleRow.tax) - Number(saleRow.discounts);
        await saleRow.update({ subtotal, total }, { transaction: t });
      }

      await t.commit();
      created += 1;
    } catch {
      await t.rollback();
    }
  }

  console.log(`✅ product_sales: insertados ${created} registro(s) falsos`);
  return created;
}
