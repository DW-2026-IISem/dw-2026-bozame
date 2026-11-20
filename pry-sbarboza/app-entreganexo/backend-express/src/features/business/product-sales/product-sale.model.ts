import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Detalle N:M Sale ↔ Product (tabla `product_sales`).
 * Opción A lab: feature propio `product-sales/`; nombre de tabla `product_sales`.
 * `unit_price` = snapshot del precio al vender; `line_total` = quantity × unit_price.
 */
export interface ProductSaleI {
  id?: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  /** Alias de solo lectura de `line_total` para el frontend (campo VIRTUAL). */
  total?: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductSale extends Model {
  public id!: number;
  public sale_id!: number;
  public product_id!: number;
  public quantity!: number;
  public unit_price!: number;
  public line_total!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductSale.init(
  {
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    line_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    // EntregaNexo: el frontend lee el total de cada línea como `total`.
    // Campo VIRTUAL (no es columna): repite `line_total` en las respuestas.
    total: {
      type: DataTypes.VIRTUAL,
      get(this: ProductSale) {
        return this.getDataValue("line_total");
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      // Fail-safe: una fila insertada sin estado explícito NO queda visible en la API.
      // La vía de creación de la API siempre envía "active".
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ProductSale",
    tableName: "product_sales",
    timestamps: true,
  }
);
