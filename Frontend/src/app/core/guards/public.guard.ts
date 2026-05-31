import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../feactures/services/private/auth.service';

export const publicGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);


    if (authService.isAuthenticated()) {
        return router.createUrlTree(['/admin/dashboard']);
    }

    return true;
};
