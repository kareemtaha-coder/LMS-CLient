import { Routes } from '@angular/router';

export const MANAGE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'curriculums',
    pathMatch: 'full',
  },
  {
    path: 'curriculums',
    loadComponent: () =>
      import(
        '../curriculums/manage-curriculums-page/manage-curriculums-page/manage-curriculums-page.component'
      ).then((m) => m.ManageCurriculumsPageComponent),
    data: { preload: true },
  },
  {
    path: 'curriculums/:id',
    loadComponent: () =>
      import(
        '../curriculums/curriculum-builder-page/curriculum-builder-page/curriculum-builder-page.component'
      ).then((m) => m.CurriculumBuilderPageComponent),
    data: { preload: true },
  },
  {
    path: 'lessons/:id',
    loadComponent: () =>
      import('../lessons/lesson-builder-page/lesson-builder-page.component').then(
        (m) => m.LessonBuilderPageComponent
      ),
    data: { preload: true },
  },
];

