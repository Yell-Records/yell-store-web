import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, filter, ReplaySubject, switchMap, take, tap, throwError } from 'rxjs';

/** Leader flag for refreshing credentials. */
let isRefreshing = false;

/**
 * Request queue for refreshing authentication credentials.
 */
let refreshSubject: ReplaySubject<string | null> | null = null;

/**
 * Attaches cookie credentials to requests and calls for a refresh if the cookie is invalid.
 *
 * @param req
 * @param next
 * @returns
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Attach the 'withCredentials' flag to every http call
  const initialCredRequest = req.clone({
    withCredentials: true,
  });

  const auth = inject(AuthService);

  // Prevent refresh call if client is not marked as logged in
  if (!auth.isLoggedIn()) {
    return next(initialCredRequest);
  }

  return next(initialCredRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject = new ReplaySubject<string | null>(1);

          // Send the refresh request to get new acccess token
          return auth.refreshCurrentSession().pipe(
            tap(() => {
              refreshSubject!.next('token');
              refreshSubject!.complete();
              isRefreshing = false;
            }),
            switchMap(() => next(req.clone({ withCredentials: true }))),
            catchError((err: HttpErrorResponse) => {
              // Refresh failed
              refreshSubject!.complete();
              isRefreshing = false;
              return throwError(() => err);
            }),
          );
        } else {
          // Await the initial response from the first refresh
          return refreshSubject!.pipe(
            filter((it) => it !== null),
            take(1),
            switchMap(() => next(req.clone({ withCredentials: true }))),
          );
        }
      }

      return throwError(() => error);
    }),
  );
};
