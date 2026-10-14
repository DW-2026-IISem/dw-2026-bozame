import { InsufficientStockException } from '../exceptions/product.exceptions.js';
export class Product {
    id;
    name;
    brand;
    price;
    minStock;
    quantity;
    productTypeId;
    status;
    constructor(props) {
        this.id = props.id ?? null;
        this.name = props.name;
        this.brand = props.brand ?? null;
        this.price = props.price;
        this.minStock = props.minStock ?? 0;
        this.quantity = props.quantity ?? 0;
        this.productTypeId = props.productTypeId;
        this.status = props.status ?? 'active';
    }
    reduceStock(n) {
        if (n < 0) {
            throw new InsufficientStockException(this.id, this.quantity, n);
        }
        if (this.quantity - n < 0) {
            throw new InsufficientStockException(this.id, this.quantity, n);
        }
        this.quantity -= n;
    }
}
//# sourceMappingURL=product.entity.js.map