export interface ClientProps {
  id?: number | null;
  documentType: string;
  documentNumber: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
}

export class Client {
  readonly id: number | null;
  readonly documentType: string;
  readonly documentNumber: string;
  readonly name: string;
  readonly phone: string | null;
  readonly email: string | null;
  readonly isActive: boolean;

  constructor(props: ClientProps) {
    this.id = props.id ?? null;
    this.documentType = props.documentType;
    this.documentNumber = props.documentNumber;
    this.name = props.name;
    this.phone = props.phone ?? null;
    this.email = props.email ?? null;
    this.isActive = props.isActive ?? true;
  }
}
