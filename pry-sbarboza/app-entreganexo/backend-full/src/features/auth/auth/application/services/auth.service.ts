import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../users/user.model.js';
import { LoginDto } from '../dto/login.dto.js';
import { generateAccessToken } from '../../../../../common/auth/jwt.util.js';

@Injectable()
export class AuthService {
  async login(dto: LoginDto) {
    // 1. Buscamos al usuario por su username
    const user = await User.findOne({ where: { username: dto.username, status: 'active' } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Verificamos la contraseña (aquí puedes agregar bcrypt si las encriptaste)
    if (user.password !== dto.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generamos su llave mágica (Token)
    const token = generateAccessToken({ id: user.id, username: user.username });
    
    return {
      message: 'Autenticación exitosa',
      user: { id: user.id, username: user.username },
      access_token: token
    };
  }
}
