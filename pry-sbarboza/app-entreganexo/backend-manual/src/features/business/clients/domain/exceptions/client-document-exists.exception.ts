import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';

export class ClientDocumentExistsException extends BusinessRuleException {
  constructor(doc: string) {
    super(`Ya existe un cliente con el documento ${doc}`);
  }
}
