import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { ResourceRoleRepository } from '../../features/auth/resource-roles/infrastructure/persistence/repositories/resource-role.repository.js';
import { pathMatches } from '../auth/resource-match.util.js';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly repo: ResourceRoleRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = (req as any).auth;
    
    if (!user) throw new ForbiddenException('Usuario no identificado');

    const method = req.method;
    const path = req.path; // Ejemplo: /api/productos/1

    // 1. Buscamos TODOS los permisos que este usuario tiene concedidos
    const permissions = await this.repo.findEffectiveForUser(user.id);
    
    // 2. Evaluamos si el método y la ruta encajan en alguno de sus permisos
    const isGranted = permissions.some(p => 
      p.method.toUpperCase() === method.toUpperCase() && 
      pathMatches(p.path, path)
    );

    // 3. Deny by Default: Si no hay match, se prohíbe el paso.
    if (!isGranted) {
      throw new ForbiddenException(`403 Prohibido — autenticado, pero sin concesión activa para ${method} ${path} (deny by default)`);
    }
    
    return true;
  }
}
