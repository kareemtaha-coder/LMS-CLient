import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.token();
  const isAuthRequest = req.url.includes('/Auth/login');
  const headers = token && !isAuthRequest
    ? req.headers.set('Authorization', `Bearer ${token}`)
    : req.headers;

  return next(req.clone({ headers })).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRequest) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};


