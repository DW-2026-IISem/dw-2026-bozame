var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/persistence/repositories/user.repository.js';
import { UserConflictException } from '../../domain/exceptions/user.exceptions.js';
import { UserMapper } from '../mappers/user.mapper.js';
let CreateUserUseCase = class CreateUserUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute(dto) {
        const conflicts = await this.repo.findConflicts(dto.username, dto.email);
        if (conflicts.length > 0) {
            const taken = conflicts[0];
            throw new UserConflictException(taken.username === dto.username.trim().toLowerCase() ? 'username' : 'email');
        }
        const user = await this.repo.create({
            username: dto.username,
            email: dto.email,
            password: dto.password,
            avatar: dto.avatar ?? null,
            status: 'active'
        });
        return UserMapper.toResponse(user);
    }
};
CreateUserUseCase = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UserRepository])
], CreateUserUseCase);
export { CreateUserUseCase };
//# sourceMappingURL=create-user.use-case.js.map