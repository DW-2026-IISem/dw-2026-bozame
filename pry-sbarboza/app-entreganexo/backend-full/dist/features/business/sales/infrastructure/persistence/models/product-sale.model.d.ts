import { Model } from 'sequelize-typescript';
import type { SaleModel as ISaleModel } from './sale.model.js';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';
export declare class ProductSaleModel extends Model {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    total: number;
    sale?: ISaleModel;
    product?: ProductModel;
}
