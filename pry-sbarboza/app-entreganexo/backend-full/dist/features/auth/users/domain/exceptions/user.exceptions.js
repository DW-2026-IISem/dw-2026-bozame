import { EntityNotFoundException, BusinessRuleException } from '../../../../../common/exceptions/application.exception.js';
export class UserNotFoundException extends EntityNotFoundException {
    constructor(id) { super(`Usuario con id ${id} no encontrado`); }
}
export class UserConflictException extends BusinessRuleException {
    constructor(field) { super(`El ${field} ya está en uso`); }
}
export class InvalidPasswordException extends BusinessRuleException {
    constructor() { super('La contraseña actual es incorrecta'); }
}
//# sourceMappingURL=user.exceptions.js.map