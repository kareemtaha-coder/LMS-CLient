import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { CourseLayoutComponent } from './features/course-layout/course-layout.component';
import { LessonLayoutComponent } from './features/lessons/lesson-layout/lesson-layout.component';
import { inject } from '@angular/core';
import { LessonContent, LessonDetails } from './Core/api/api-models';
import { LessonService } from './features/lessons/lesson.service';
import { ContentHostComponent } from './features/lessons/content-host/content-host.component';

// Resolver for the entire lesson object.
const lessonResolver: ResolveFn<LessonDetails | null> = (route: ActivatedRouteSnapshot) => {
  const lessonService = inject(LessonService);
  const lessonId = route.paramMap.get('lessonId');
  if (lessonId) {
    return lessonService.loadLessonById(lessonId);
  }
  return null;
};

// The content resolver is no longer needed by the router directly.
// const contentResolver: ResolveFn<LessonContent | undefined> = ...

export const routes: Routes = [
  { path: '', redirectTo: 'curriculums', pathMatch: 'full' },
  { path: 'curriculums', loadComponent: () => import('./features/curriculums/curriculum-list/curriculum-list.component').then(m => m.CurriculumListComponent) },
  {
    path: 'course/:id',
    component: CourseLayoutComponent,
    children: [
      {
        path: 'lessons/:lessonId',
        component: LessonLayoutComponent,
        resolve: {
          lesson: lessonResolver
        },
        // The children array has been REMOVED from here to prevent the URL from changing.
        // Content will now be managed by the LessonLayoutComponent itself.
      }
    ]
  },
];
