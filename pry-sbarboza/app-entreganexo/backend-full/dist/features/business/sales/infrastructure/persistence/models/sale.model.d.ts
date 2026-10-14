import { Model } from 'sequelize-typescript';
import { ClientModel } from '../../../../clients/infrastructure/persistence/models/client.model.js';
import type { ProductSaleModel as IProductSaleModel } from './product-sale.model.js';
export declare class SaleModel extends Model {
    id: number;
    saleDate: Date;
    subtotal: number;
    tax: number;
    discounts: number;
    total: number;
    status: string;
    clientId: number;
    client?: ClientModel;
    items?: IProductSaleModel[];
}
