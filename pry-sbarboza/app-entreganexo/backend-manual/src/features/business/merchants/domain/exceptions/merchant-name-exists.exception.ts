import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';

export class MerchantNameExistsException extends BusinessRuleException {
  constructor(name: string) {
    super(`Ya existe un comercio con el nombre ${name}`);
  }
}
