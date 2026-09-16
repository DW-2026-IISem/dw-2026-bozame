import { Merchant } from '../entities/merchant.entity.js';

export const MERCHANT_REPOSITORY = 'IMerchantRepository';

export interface IMerchantRepository {
  create(merchant: Merchant): Promise<Merchant>;
  findAll(page: number, limit: number): Promise<{ items: Merchant[]; total: number }>;
  findById(id: number): Promise<Merchant | null>;
  findByName(name: string): Promise<Merchant | null>;
  count(): Promise<number>;
}
