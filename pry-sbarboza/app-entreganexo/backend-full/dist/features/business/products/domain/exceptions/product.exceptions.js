import { EntityNotFoundException, BusinessRuleException } from '../../../../../common/exceptions/application.exception.js';
export class ProductNotFoundException extends EntityNotFoundException {
    constructor(id) { super(`Producto con id ${id} no encontrado`); }
}
export class ProductTypeInactiveException extends BusinessRuleException {
    constructor(id) { super(`El tipo de producto ${id} está inactivo`); }
}
export class InsufficientStockException extends BusinessRuleException {
    constructor(id, current, requested) {
        super(`Stock insuficiente para el producto ${id}. Actual: ${current}, Solicitado: ${requested}`);
    }
}
//# sourceMappingURL=product.exceptions.js.map