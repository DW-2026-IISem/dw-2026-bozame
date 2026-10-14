import { EntityNotFoundException, BusinessRuleException } from '../../../../../common/exceptions/application.exception.js';
export declare class SaleNotFoundException extends EntityNotFoundException {
    constructor(id: number);
}
export declare class EmptySaleException extends BusinessRuleException {
    constructor();
}
