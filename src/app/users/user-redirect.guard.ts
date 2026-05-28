import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../core/stores/user.store';

export const userRedirectGuard: CanActivateFn = () => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  return userStore.isLoggedIn() ? router.createUrlTree(['/home']) : true;
};
