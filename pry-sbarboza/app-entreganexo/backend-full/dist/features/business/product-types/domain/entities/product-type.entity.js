export class ProductType {
    id;
    name;
    description;
    status;
    constructor(props) {
        this.id = props.id ?? null;
        this.name = props.name;
        this.description = props.description ?? null;
        this.status = props.status ?? 'active';
    }
}
//# sourceMappingURL=product-type.entity.js.map