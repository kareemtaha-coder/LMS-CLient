﻿import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  auth.setError(null);
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
