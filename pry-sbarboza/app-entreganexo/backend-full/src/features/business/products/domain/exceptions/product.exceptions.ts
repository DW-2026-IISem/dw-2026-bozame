import { EntityNotFoundException, BusinessRuleException } from '../../../../../common/exceptions/application.exception.js';

export class ProductNotFoundException extends EntityNotFoundException {
  constructor(id: number) { super(`Producto con id ${id} no encontrado`); }
}

export class ProductTypeInactiveException extends BusinessRuleException {
  constructor(id: number) { super(`El tipo de producto ${id} está inactivo`); }
}

export class InsufficientStockException extends BusinessRuleException {
  constructor(id: number | null, current: number, requested: number) {
    super(`Stock insuficiente para el producto ${id}. Actual: ${current}, Solicitado: ${requested}`);
  }
}
