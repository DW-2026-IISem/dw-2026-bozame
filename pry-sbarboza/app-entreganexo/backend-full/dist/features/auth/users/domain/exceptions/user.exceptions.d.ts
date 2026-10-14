import { EntityNotFoundException, BusinessRuleException } from '../../../../../common/exceptions/application.exception.js';
export declare class UserNotFoundException extends EntityNotFoundException {
    constructor(id: number);
}
export declare class UserConflictException extends BusinessRuleException {
    constructor(field: string);
}
export declare class InvalidPasswordException extends BusinessRuleException {
    constructor();
}
