import { EntityNotFoundException, BusinessRuleException } from '../../../../../common/exceptions/application.exception.js';
export declare class ProductNotFoundException extends EntityNotFoundException {
    constructor(id: number);
}
export declare class ProductTypeInactiveException extends BusinessRuleException {
    constructor(id: number);
}
export declare class InsufficientStockException extends BusinessRuleException {
    constructor(id: number | null, current: number, requested: number);
}
