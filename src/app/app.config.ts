import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { BASE_URL } from './Core/api/base-url.token';
import { routes } from './app.routes';
import { ComponentPreloaderService } from './Core/router/component-preloader.service';
import { authInterceptor } from './Core/auth/auth.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: BASE_URL, useValue: environment.apiUrl },
    { provide: APP_INITIALIZER, multi: true, deps: [ComponentPreloaderService], useFactory: () => () => {} },
  ]
};
