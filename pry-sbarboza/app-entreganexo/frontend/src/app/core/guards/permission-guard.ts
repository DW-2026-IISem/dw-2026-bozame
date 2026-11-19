import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionStore } from '../services/session-store';

/** Valida los permisos explícitos definidos en las rutas. */
export const permissionGuard: CanActivateFn = (route) => {
  const session = inject(SessionStore);
  const router = inject(Router);
  if (!environment.requireAuth) {
    return true;
  }
  const permission = route.data?.['permission'] as string | undefined;
  if (!permission || session.canPermission(permission)) {
    return true;
  }
  return router.createUrlTree(['/forbidden'], {
    queryParams: { permission },
  });
};
