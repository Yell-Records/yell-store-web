import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

/**
 * Redirect a non-user back to the original page from editing.
 *
 * @param route
 * @returns
 */
export const editGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn) {
    return true;
  }

  // Remove "/edit" from the end of the URL
  const url = route.url.map((u) => u.path);
  const withoutEdit = url.slice(0, -1).join('/');

  router.navigate([`/${withoutEdit}`]);

  return false;
};
