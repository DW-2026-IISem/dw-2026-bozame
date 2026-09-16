import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';

export class ProductSkuExistsException extends BusinessRuleException {
  constructor(sku: string) {
    super(`Ya existe un producto con el SKU ${sku}`);
  }
}
