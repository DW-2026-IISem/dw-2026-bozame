export interface MerchantProps {
  id?: number | null;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export class Merchant {
  readonly id: number | null;
  readonly name: string;
  readonly description: string | null;
  readonly isActive: boolean;

  constructor(props: MerchantProps) {
    this.id = props.id ?? null;
    this.name = props.name;
    this.description = props.description ?? null;
    this.isActive = props.isActive ?? true;
  }
}
