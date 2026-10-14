import { EntityNotFoundException, BusinessRuleException } from '../../../../../common/exceptions/application.exception.js';

export class UserNotFoundException extends EntityNotFoundException {
  constructor(id: number) { super(`Usuario con id ${id} no encontrado`); }
}

export class UserConflictException extends BusinessRuleException {
  constructor(field: string) { super(`El ${field} ya está en uso`); }
}

export class InvalidPasswordException extends BusinessRuleException {
  constructor() { super('La contraseña actual es incorrecta'); }
}
