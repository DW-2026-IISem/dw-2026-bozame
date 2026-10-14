import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { verifyAccessToken } from '../auth/jwt.util.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('401 No autenticado — falta el Bearer token');
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token);
      // Guardamos la identidad del usuario en la petición para que el siguiente Guard la use
      (req as any).auth = { id: parseInt(payload.sub as string), username: payload.username };
      return true;
    } catch (error) {
      throw new UnauthorizedException('401 No autenticado — token inválido o expirado');
    }
  }
}
