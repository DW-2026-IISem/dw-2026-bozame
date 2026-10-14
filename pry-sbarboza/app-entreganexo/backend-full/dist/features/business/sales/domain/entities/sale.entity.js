export class Sale {
    id;
    saleDate;
    subtotal;
    tax;
    discounts;
    total;
    status;
    clientId;
    items;
    constructor(props) {
        this.id = props.id ?? null;
        this.saleDate = props.saleDate ?? new Date();
        this.subtotal = props.subtotal;
        this.tax = props.tax;
        this.discounts = props.discounts;
        this.total = props.total;
        this.status = props.status ?? 'completed';
        this.clientId = props.clientId;
        this.items = props.items;
    }
}
//# sourceMappingURL=sale.entity.js.map