import { Status, Timestamps } from './api.model';

export interface Client extends Timestamps {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  status: Status;
}

export interface ClientPayload {
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: Status;
}
