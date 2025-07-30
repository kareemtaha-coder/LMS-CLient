import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core'; // <-- 1. استيراد المزود الجديد
import { BASE_URL } from './Core/api/base-url.token'; // Import the token
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 2. تفعيل استراتيجية Zoneless الحديثة
    provideZoneChangeDetection(),
// Pass the feature to provideRouter
    provideRouter(routes, withComponentInputBinding()),

    // 4. توفير خدمة HttpClient لحل الخطأ السابق
    provideHttpClient(),
    // 3. توفير عنوان URL الأساسي باستخدام التوكن
    { provide: BASE_URL, useValue: 'https://localhost:7255' },

  ]
};
