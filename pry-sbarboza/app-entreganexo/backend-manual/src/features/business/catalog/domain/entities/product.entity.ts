export interface ProductProps {
  id?: number | null;
  sku: string;
  name: string;
  description?: string | null;
  price: number;
  isActive?: boolean;
  merchantId: number;
}

export class Product {
  readonly id: number | null;
  readonly sku: string;
  readonly name: string;
  readonly description: string | null;
  readonly price: number;
  readonly isActive: boolean;
  readonly merchantId: number;

  constructor(props: ProductProps) {
    this.id = props.id ?? null;
    this.sku = props.sku;
    this.name = props.name;
    this.description = props.description ?? null;
    this.price = props.price;
    this.isActive = props.isActive ?? true;
    this.merchantId = props.merchantId;
  }
}
