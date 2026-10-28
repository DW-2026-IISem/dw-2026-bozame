export type Status = 'active' | 'inactive';
export type Money = number | string;

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export function toNumber(value: Money | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  return typeof value === 'number' ? value : Number.parseFloat(value) || 0;
}
