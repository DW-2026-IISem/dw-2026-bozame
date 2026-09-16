import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';

export class MerchantInactiveException extends BusinessRuleException {
  constructor(id: number) {
    super(`El comercio con id ${id} está inactivo`);
  }
}
