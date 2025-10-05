import { Routes } from '@angular/router';
import { authGuard } from './Core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'curriculums',
    loadComponent: () =>
      import('./features/curriculums/curriculum-list/curriculum-list.component').then(
        (m) => m.CurriculumListComponent
      ),
    canActivate: [authGuard],
    data: { preload: true, requiresAuth: true },
  },
  {
    path: 'course/:id',
    loadComponent: () =>
      import('./features/course-layout/course-layout.component').then(
        (m) => m.CourseLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './features/curriculums/curriculum-details/curriculum-details.component'
          ).then((m) => m.CurriculumDetailsComponent),
        canActivate: [authGuard],
        data: { preload: true, requiresAuth: true },
      },
      {
        path: 'lessons/:lessonId',
        loadComponent: () =>
          import('./features/lessons/lesson-layout/lesson-layout.component').then(
            (m) => m.LessonLayoutComponent
          ),
        canActivate: [authGuard],
        data: { preload: true, requiresAuth: true },
      },
    ],
  },
  {
    path: 'manage',
    loadChildren: () =>
      import('./features/manage/manage.routes').then((m) => m.MANAGE_ROUTES),
    canActivate: [authGuard],
    data: { preload: true, requiresAuth: true },
  },
  { path: '', redirectTo: '/curriculums', pathMatch: 'full' },
  { path: '**', redirectTo: '/curriculums' },
];


