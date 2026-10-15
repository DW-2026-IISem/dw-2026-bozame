var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../users/user.model.js';
import { generateAccessToken } from '../../../../../common/auth/jwt.util.js';
let AuthService = class AuthService {
    async login(dto) {
        const user = await User.findOne({ where: { username: dto.username } });
        if (!user) {
            throw new UnauthorizedException('El usuario no existe en la base de datos');
        }
        const token = generateAccessToken({ id: user.id, username: user.username });
        return {
            message: 'Autenticación exitosa',
            user: { id: user.id, username: user.username },
            access_token: token
        };
    }
};
AuthService = __decorate([
    Injectable()
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map