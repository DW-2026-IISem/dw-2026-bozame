import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class EmptyOrderException extends DomainException {
  constructor() {
    super('El pedido debe tener al menos un producto (detalle)');
  }
}
