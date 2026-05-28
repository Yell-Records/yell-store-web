import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

/**
 * Interceptor which attaches the login token to every request.
 *
 * @param req
 * @param next
 * @returns
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    withCredentials: true,
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const auth = inject(AuthService);
        // Attemp refresh call
        return auth.refreshCurrentSession().pipe(
          switchMap(() => next(req)),
          catchError(() => throwError(() => error)),
        );
      }

      return throwError(() => error);
    }),
  );
};
