import { Transaction } from "sequelize";
import {
  CreateSaleDto,
  CreateSaleResultDto,
  PatchSaleDto,
  SaleResponseDto,
  UpdateSaleDto,
  toSaleResponse,
} from "./dto";
import { toProductSaleResponse } from "../product-sales/dto";
import { SalesRepository } from "./sales.repository";
import { ProductSalesRepository } from "../product-sales/product-sales.repository";
import { ProductsRepository } from "../products/products.repository";
import { ClientsRepository } from "../clients/clients.repository";
import { Product } from "../products/product.model";
import { ProductSale } from "../product-sales/product-sale.model";
import { Sale } from "./sale.model";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

/** Línea calculada en memoria antes de persistir la venta (tipo interno, no DTO). */
type SaleLine = {
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  product: Product;
};

/**
 * Capa Service del feature Sales.
 *
 * Reglas de negocio de una venta: exige al menos una línea, valida cliente y
 * productos activos, controla stock, calcula subtotal/total y garantiza
 * atomicidad con una transacción (unit of work).
 *
 * Persistencia delegada en los repositories de Sales, ProductSales, Products y
 * Clients. Entrada y salida se expresan con **DTOs** (carpeta `dto/`): nunca se
 * devuelve una instancia de Sequelize.
 */
export class SalesService {
  public constructor(
    private readonly repository: SalesRepository = new SalesRepository(),
    private readonly productSalesRepository: ProductSalesRepository = new ProductSalesRepository(),
    private readonly productsRepository: ProductsRepository = new ProductsRepository(),
    private readonly clientsRepository: ClientsRepository = new ClientsRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<SaleResponseDto[]> {
    const sales = await this.repository.findAllActiveWithItems();
    return sales.map((sale) => toSaleResponse(sale));
  }

  public async getOne(id: number): Promise<SaleResponseDto> {
    return toSaleResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  /** Crea la venta completa (cabecera + líneas) en una sola transacción. */
  public async create(body: CreateSaleDto): Promise<CreateSaleResultDto> {
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      throw new AppError(400, "Sale requires at least one item");
    }

    return withTransaction(async (t) => {
      await this.assertActiveClient(body.client_id, t);

      const lineRows: SaleLine[] = [];
      let subtotal = 0;

      // Orden canónico de locks: se bloquean los productos de menor a mayor
      // `product_id`. Si dos ventas simultáneas traen los mismos productos en
      // distinto orden, bloquear en orden ascendente evita el deadlock.
      const orderedItems = [...body.items].sort(
        (a, b) => Number(a.product_id) - Number(b.product_id)
      );

      for (const item of orderedItems) {
        const product = await this.productsRepository.findByIdForUpdate(item.product_id, t);
        if (!product) {
          throw new AppError(404, `Product not found: ${item.product_id}`);
        }
        if (product.status !== "active") {
          throw new AppError(400, `Product must be active: ${item.product_id}`);
        }
        if (product.quantity < item.quantity) {
          throw new AppError(
            400,
            `Insufficient stock for product ${item.product_id} (available: ${product.quantity}, requested: ${item.quantity})`
          );
        }

        const unit_price = Number(product.price);
        const line_total = unit_price * item.quantity;
        subtotal += line_total;
        lineRows.push({
          product_id: product.id,
          quantity: item.quantity,
          unit_price,
          line_total,
          product,
        });
      }

      const tax = Number(body.tax ?? 0);
      const discounts = Number(body.discounts ?? 0);
      const total = subtotal + tax - discounts;

      const sale = await this.repository.create(
        {
          sale_date: body.sale_date ?? new Date(),
          subtotal,
          tax,
          discounts,
          total,
          client_id: body.client_id,
          status: body.status ?? "active",
        },
        t
      );

      const items: ProductSale[] = [];
      for (const line of lineRows) {
        const productSale = await this.productSalesRepository.create(
          {
            sale_id: sale.id,
            product_id: line.product_id,
            quantity: line.quantity,
            unit_price: line.unit_price,
            line_total: line.line_total,
            status: "active",
          },
          t
        );
        await this.productsRepository.update(
          line.product,
          { quantity: line.product.quantity - line.quantity },
          t
        );
        items.push(productSale);
      }

      return {
        sale: toSaleResponse(sale),
        items: items.map((item) => toProductSaleResponse(item)),
      };
    });
  }

  // ================== UPDATE ==================
  /** PUT: reemplaza la cabecera (las líneas se gestionan en ProductSales). */
  public async updatePut(id: number, body: UpdateSaleDto): Promise<SaleResponseDto> {
    const sale = await this.findOrFail(id);

    if (body.client_id !== undefined) {
      await this.assertActiveClient(body.client_id);
    }

    const tax = Number(body.tax ?? 0);
    const discounts = Number(body.discounts ?? 0);
    const total = Number(sale.subtotal) + tax - discounts;

    await this.repository.update(sale, {
      sale_date: body.sale_date ?? sale.sale_date,
      tax,
      discounts,
      total,
      client_id: body.client_id ?? sale.client_id,
    });

    return toSaleResponse(sale);
  }

  /** PATCH: cambia sólo lo que llega (lo omitido se conserva). */
  public async updatePatch(id: number, body: PatchSaleDto): Promise<SaleResponseDto> {
    const sale = await this.findOrFail(id);

    if (body.client_id !== undefined) {
      await this.assertActiveClient(body.client_id);
    }

    const tax = body.tax !== undefined ? Number(body.tax) : Number(sale.tax);
    const discounts =
      body.discounts !== undefined ? Number(body.discounts) : Number(sale.discounts);
    const needsRecalc = body.tax !== undefined || body.discounts !== undefined;

    // Sólo se aplican los campos del DTO: `total` y `subtotal` siempre los
    // calcula el service, nunca llegan desde el cliente.
    await this.repository.update(sale, {
      sale_date: body.sale_date ?? sale.sale_date,
      client_id: body.client_id ?? sale.client_id,
      tax,
      discounts,
      total: needsRecalc ? Number(sale.subtotal) + tax - discounts : Number(sale.total),
    });

    return toSaleResponse(sale);
  }

  // ================== DELETE ==================
  /** Eliminación física: restaura stock de las líneas activas, líneas y venta. */
  public async deletePhysical(id: number): Promise<void> {
    await withTransaction(async (t) => {
      // Sin filtro de `status`: purga también ventas con borrado lógico.
      // Bloquear la fila de la venta primero respeta el orden canónico del
      // feature: `sales` -> `products` -> `product_sales`.
      const sale = await this.repository.findByIdForUpdate(id, t);
      if (!sale) {
        throw new AppError(404, "Sale not found");
      }

      await this.releaseStockOfActiveLines(id, t);
      await this.productSalesRepository.deleteBySaleId(id, t);
      await this.repository.delete(sale, t);
    });
  }

  /** Eliminación lógica -> `status = inactive` (venta + líneas, restaurando stock). */
  public async deleteLogical(id: number): Promise<SaleResponseDto> {
    return withTransaction(async (t) => {
      const sale = await this.findOrFail(id, t);

      await this.repository.findByIdForUpdate(id, t);
      await this.releaseStockOfActiveLines(id, t);

      await this.repository.update(sale, { status: "inactive" }, t);
      await this.productSalesRepository.deactivateBySaleId(id, t);

      // Relectura para que la respuesta muestre las líneas ya desactivadas.
      const updated = await this.repository.findWithItemsById(id, t);
      return toSaleResponse(updated ?? sale);
    });
  }

  // ================== HELPERS DE NEGOCIO ==================
  /**
   * Devuelve al stock el `quantity` de cada **línea activa** de la venta.
   *
   * Borrar o desactivar una venta equivale a borrar/desactivar sus líneas, así
   * que el stock se restaura igual que en `ProductSalesService`. Las líneas ya
   * inactivas no se tocan: su stock volvió cuando se desactivaron.
   *
   * Los productos se bloquean en orden ascendente de `product_id`, el mismo
   * orden que usa `create`, para que dos transacciones que tocan los mismos
   * productos no se interbloqueen. Es seguro leer las líneas antes de bloquear
   * los productos porque ya se tiene el X-lock de la fila `sales`, y todos los
   * flujos que modifican líneas bloquean antes esa fila.
   */
  private async releaseStockOfActiveLines(sale_id: number, t: Transaction): Promise<void> {
    const lines = await this.productSalesRepository.findActiveBySaleId(sale_id, t);
    const ordered = [...lines].sort((a, b) => a.product_id - b.product_id);

    for (const line of ordered) {
      const product = await this.productsRepository.findByIdForUpdate(line.product_id, t);
      if (!product) {
        continue;
      }
      await this.productsRepository.update(
        product,
        { quantity: product.quantity + line.quantity },
        t
      );
    }
  }

  /**
   * Busca la venta con sus líneas y falla con 404 si no existe o si tiene
   * borrado lógico.
   *
   * Es el único punto donde se aplica la **política de borrado lógico** del
   * feature, así que `getOne`, `updatePut`, `updatePatch` y `deleteLogical`
   * quedan automáticamente consistentes con el filtro de `getAll`.
   *
   * Dos diferencias con los demás features (deliberadas):
   *  - la venta se lee **con sus líneas** (`findWithItemsById`), así que el
   *    segundo parámetro es la `transaction`, no el flag `onlyActive`;
   *  - `deletePhysical` no lo usa: necesita un `SELECT ... FOR UPDATE` propio,
   *    porque debe poder purgar también ventas con borrado lógico.
   */
  private async findOrFail(id: number, transaction?: Transaction): Promise<Sale> {
    const sale = await this.repository.findWithItemsById(id, transaction);
    if (!sale || sale.status !== "active") {
      throw new AppError(404, "Sale not found");
    }
    return sale;
  }

  /** Regla: el cliente de la venta debe existir y estar activo. */
  private async assertActiveClient(
    client_id: number,
    transaction?: Transaction
  ): Promise<void> {
    const client = await this.clientsRepository.findById(client_id, transaction);
    if (!client) {
      throw new AppError(404, "Client not found");
    }
    if (client.status !== "active") {
      throw new AppError(400, "Client must be active");
    }
  }
}
