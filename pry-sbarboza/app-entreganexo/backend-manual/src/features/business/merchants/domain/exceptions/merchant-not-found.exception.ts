import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class MerchantNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Comercio con id ${id} no encontrado`);
  }
}
