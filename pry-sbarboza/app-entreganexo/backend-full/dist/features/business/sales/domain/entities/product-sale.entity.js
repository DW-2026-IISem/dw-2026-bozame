export class ProductSale {
    id;
    saleId;
    productId;
    quantity;
    unitPrice;
    total;
    constructor(props) {
        this.id = props.id ?? null;
        this.saleId = props.saleId ?? null;
        this.productId = props.productId;
        this.quantity = props.quantity;
        this.unitPrice = props.unitPrice;
        this.total = props.total;
    }
}
//# sourceMappingURL=product-sale.entity.js.map