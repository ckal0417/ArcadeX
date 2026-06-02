import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../feactures/services/private/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.getToken()) {
    return router.createUrlTree(['/login']);
  }

  const hasRole = allowedRoles.some(role => auth.getRoles().includes(role));

  if (!hasRole) {
    return router.createUrlTree([auth.getDashboardRoute()]);
  }

  return true;
};
