import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../core/stores/user.store';

/**
 * Accepts only clients that have an authorization role of admin or superadmin.
 * Navigates to 404 on failure.
 *
 * @returns
 */
export const adminGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  if (!userStore.hasUser()) {
    return router.createUrlTree(['/404']);
  }

  const role = userStore.user!.role;
  if (role === null || role !== 'ADMIN') {
    return router.createUrlTree(['/404']);
  }

  return true;
};
