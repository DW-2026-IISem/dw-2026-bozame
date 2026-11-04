import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';
import { NotificationService } from '../services/notification';

export const permissionGuard: CanActivateFn = (route) => {
  const session = inject(SessionStore);
  const router = inject(Router);
  const notify = inject(NotificationService);

  const requiredPermission = route.data?.['permission'] as string | undefined;

  if (!requiredPermission || session.canPermission(requiredPermission)) {
    return true;
  }

  notify.error('Acceso denegado', 'No cuentas con los privilegios requeridos para esta sección.');
  void router.navigate(['/dashboard']);
  return false;
};
