import { EntityNotFoundException, BusinessRuleException } from '../../../../../common/exceptions/application.exception.js';
export class SaleNotFoundException extends EntityNotFoundException {
    constructor(id) { super(`Venta con id ${id} no encontrada`); }
}
export class EmptySaleException extends BusinessRuleException {
    constructor() { super('La venta debe tener al menos un ítem'); }
}
//# sourceMappingURL=sale.exceptions.js.map