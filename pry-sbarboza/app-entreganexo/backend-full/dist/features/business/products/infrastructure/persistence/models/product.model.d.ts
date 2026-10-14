import { Model } from 'sequelize-typescript';
import { ProductTypeModel } from '../../../../product-types/infrastructure/persistence/models/product-type.model.js';
export declare class ProductModel extends Model {
    id: number;
    name: string;
    brand: string | null;
    price: number;
    minStock: number;
    quantity: number;
    productTypeId: number;
    productType?: ProductTypeModel;
    status: string;
}
