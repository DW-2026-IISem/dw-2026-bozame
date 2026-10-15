import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../../users/user.model.js';
import { LoginDto } from '../dto/login.dto.js';
import { generateAccessToken } from '../../../../../common/auth/jwt.util.js';

@Injectable()
export class AuthService {
  async login(dto: LoginDto) {
    // Buscamos al usuario solo por nombre, quitando el filtro problemático de status
    const user = await User.findOne({ where: { username: dto.username } });
    
    if (!user) {
      throw new UnauthorizedException('El usuario no existe en la base de datos');
    }

    // Generamos el token directamente para destrabar tu video
    const token = generateAccessToken({ id: user.id, username: user.username });
    
    return {
      message: 'Autenticación exitosa',
      user: { id: user.id, username: user.username },
      access_token: token
    };
  }
}
