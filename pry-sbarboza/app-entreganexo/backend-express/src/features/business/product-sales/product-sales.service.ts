import { Transaction } from "sequelize";
import {
  CreateProductSaleDto,
  PatchProductSaleDto,
  ProductSaleResponseDto,
  UpdateProductSaleDto,
  toProductSaleResponse,
} from "./dto";
import { ProductSale } from "./product-sale.model";
import { ProductSalesRepository } from "./product-sales.repository";
import { SalesRepository } from "../sales/sales.repository";
import { ProductsRepository } from "../products/products.repository";
import { Product } from "../products/product.model";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";

/**
 * Capa Service del feature ProductSales (tabla `product_sales`).
 *
 * Reglas de negocio de una línea de venta: valida venta y producto activos,
 * controla stock, mantiene el stock del producto y recalcula los totales de la
 * venta; todo dentro de una transacción.
 *
 * **Orden canónico de locks**: `sales` -> `products` -> `product_sales`. Todos
 * los flujos del feature lo respetan para evitar deadlocks de InnoDB.
 *
 * Entrada y salida se expresan con **DTOs** (carpeta `dto/`): el service nunca
 * devuelve la instancia de Sequelize, sino un objeto plano de respuesta.
 */
export class ProductSalesService {
  public constructor(
    private readonly repository: ProductSalesRepository = new ProductSalesRepository(),
    private readonly salesRepository: SalesRepository = new SalesRepository(),
    private readonly productsRepository: ProductsRepository = new ProductsRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ProductSaleResponseDto[]> {
    const productSales = await this.repository.findAllActive();
    return productSales.map((productSale) => toProductSaleResponse(productSale));
  }

  public async getOne(id: number): Promise<ProductSaleResponseDto> {
    return toProductSaleResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  /** Agrega una línea a una venta existente (ajusta stock y totales). */
  public async create(body: CreateProductSaleDto): Promise<ProductSaleResponseDto> {
    if (!body.sale_id || !body.product_id || !body.quantity || body.quantity < 1) {
      throw new AppError(400, "sale_id, product_id and quantity (>=1) are required");
    }

    return withTransaction(async (t) => {
      // Orden canónico de locks del feature: `sales` -> `products` -> `product_sales`.
      // Bloquear la venta primero evita el deadlock por *upgrade* S->X del FK:
      // el INSERT en `product_sales` dejaría un S-lock en la fila padre `sales`
      // y `recalcSaleTotals` pediría luego un X-lock sobre ella.
      const sale = await this.salesRepository.findByIdForUpdate(body.sale_id, t);
      if (!sale) {
        throw new AppError(404, "Sale not found");
      }
      if (sale.status !== "active") {
        throw new AppError(400, "Sale must be active");
      }

      const product = await this.productsRepository.findByIdForUpdate(body.product_id, t);
      if (!product) {
        throw new AppError(404, "Product not found");
      }
      if (product.status !== "active") {
        throw new AppError(400, "Product must be active");
      }
      if (product.quantity < body.quantity) {
        throw new AppError(
          400,
          `Insufficient stock (available: ${product.quantity}, requested: ${body.quantity})`
        );
      }

      const unit_price = Number(product.price);
      const line_total = unit_price * body.quantity;

      const productSale = await this.repository.create(
        {
          sale_id: body.sale_id,
          product_id: body.product_id,
          quantity: body.quantity,
          unit_price,
          line_total,
          status: body.status ?? "active",
        },
        t
      );

      await this.productsRepository.update(product, { quantity: product.quantity - body.quantity }, t);
      await this.recalcSaleTotals(body.sale_id, t);

      return toProductSaleResponse(productSale);
    });
  }

  // ================== UPDATE ==================
  public async updatePut(
    id: number,
    body: UpdateProductSaleDto
  ): Promise<ProductSaleResponseDto> {
    return withTransaction(async (t) => {
      const { productSale, product } = await this.lockLine(id, t);

      const newQty = Number(body.quantity);
      if (!newQty || newQty < 1) {
        throw new AppError(400, "quantity (>=1) is required");
      }
      if (!product) {
        throw new AppError(404, "Product not found");
      }

      await this.applyQuantityDelta(productSale, product, newQty, t);

      await this.repository.update(
        productSale,
        { quantity: newQty, line_total: Number(productSale.unit_price) * newQty },
        t
      );
      await this.recalcSaleTotals(productSale.sale_id, t);

      return toProductSaleResponse(productSale);
    });
  }

  public async updatePatch(
    id: number,
    body: PatchProductSaleDto
  ): Promise<ProductSaleResponseDto> {
    return withTransaction(async (t) => {
      const { productSale, product } = await this.lockLine(id, t);

      if (body.quantity !== undefined) {
        const newQty = Number(body.quantity);
        if (!newQty || newQty < 1) {
          throw new AppError(400, "quantity must be >= 1");
        }
        if (!product) {
          throw new AppError(404, "Product not found");
        }

        await this.applyQuantityDelta(productSale, product, newQty, t);
        await this.repository.update(
          productSale,
          { quantity: newQty, line_total: Number(productSale.unit_price) * newQty },
          t
        );
      }

      await this.recalcSaleTotals(productSale.sale_id, t);
      return toProductSaleResponse(productSale);
    });
  }

  // ================== DELETE ==================
  /** Eliminación física: restaura stock y recalcula totales de la venta. */
  public async deletePhysical(id: number): Promise<void> {
    await withTransaction(async (t) => {
      // `onlyActive: false` -> también permite purgar líneas ya desactivadas.
      const { productSale, product } = await this.lockLine(id, t, false);

      if (productSale.status === "active" && product) {
        await this.productsRepository.update(
          product,
          { quantity: product.quantity + productSale.quantity },
          t
        );
      }

      const sale_id = productSale.sale_id;
      await this.repository.delete(productSale, t);
      await this.recalcSaleTotals(sale_id, t);
    });
  }

  /** Eliminación lógica -> `status = inactive` (restaura stock y recalcula). */
  public async deleteLogical(id: number): Promise<ProductSaleResponseDto> {
    return withTransaction(async (t) => {
      const { productSale, product } = await this.lockLine(id, t);

      // `lockLine` ya garantiza que la línea está activa, así que se restaura stock.
      if (product) {
        await this.productsRepository.update(
          product,
          { quantity: product.quantity + productSale.quantity },
          t
        );
      }

      await this.repository.update(productSale, { status: "inactive" }, t);
      await this.recalcSaleTotals(productSale.sale_id, t);
      return toProductSaleResponse(productSale);
    });
  }

  // ================== HELPERS DE NEGOCIO ==================
  /**
   * Busca la línea por PK y falla con 404 si no existe.
   *
   * `onlyActive` (por defecto `true`) aplica la política de borrado lógico: una
   * línea `inactive` deja de ser visible para la API, igual que en `getAll`.
   */
  private async findOrFail(id: number, onlyActive = true): Promise<ProductSale> {
    const productSale = await this.repository.findById(id);
    if (!productSale || (onlyActive && productSale.status !== "active")) {
      throw new AppError(404, "Product sale not found");
    }
    return productSale;
  }

  /**
   * Bloquea la venta, el producto y la línea en el **orden canónico del feature**:
   * `sales` -> `products` -> `product_sales`.
   *
   * Bloquear en un orden distinto en cada flujo produce interbloqueos (deadlock
   * de InnoDB) cuando dos peticiones simultáneas tocan las mismas filas. Además,
   * bloquear `sales` antes de insertar/actualizar en `product_sales` evita el
   * *upgrade* S->X que provoca el FK cuando luego se recalcula el total de la venta.
   *
   * `sale_id` y `product_id` son inmutables (el DTO de update solo expone
   * `quantity`), por eso se leen sin lock para descubrirlos antes de bloquear
   * las filas padre. `onlyActive` decide si una línea desactivada cuenta como
   * inexistente (404) o no.
   */
  private async lockLine(
    id: number,
    t: Transaction,
    onlyActive = true
  ): Promise<{ productSale: ProductSale; product: Product | null }> {
    const snapshot = await this.repository.findById(id, t);
    if (!snapshot) {
      throw new AppError(404, "Product sale not found");
    }

    await this.salesRepository.findByIdForUpdate(snapshot.sale_id, t);

    const product = await this.productsRepository.findByIdForUpdate(snapshot.product_id, t);

    const productSale = await this.repository.findByIdForUpdate(id, t);
    if (!productSale || (onlyActive && productSale.status !== "active")) {
      throw new AppError(404, "Product sale not found");
    }

    return { productSale, product };
  }

  /**
   * Ajusta el stock del producto según la diferencia entre la cantidad nueva
   * y la anterior. Falla si no hay stock suficiente para un aumento.
   */
  private async applyQuantityDelta(
    productSale: ProductSale,
    product: Product,
    newQty: number,
    t: Transaction
  ): Promise<void> {
    const delta = newQty - productSale.quantity;
    if (delta > 0 && product.quantity < delta) {
      throw new AppError(
        400,
        `Insufficient stock (available: ${product.quantity}, requested_extra: ${delta})`
      );
    }

    if (delta !== 0) {
      await this.productsRepository.update(product, { quantity: product.quantity - delta }, t);
    }
  }

  /** Recalcula `subtotal` y `total` de la venta a partir de sus líneas activas. */
  private async recalcSaleTotals(sale_id: number, t: Transaction): Promise<void> {
    const items = await this.repository.findActiveBySaleId(sale_id, t);
    const subtotal = items.reduce((sum, row) => sum + Number(row.line_total), 0);

    const sale = await this.salesRepository.findById(sale_id, t);
    if (!sale) {
      return;
    }

    const total = subtotal + Number(sale.tax) - Number(sale.discounts);
    await this.salesRepository.update(sale, { subtotal, total }, t);
  }
}
