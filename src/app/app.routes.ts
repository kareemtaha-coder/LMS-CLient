import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { CourseLayoutComponent } from './features/course-layout/course-layout.component';
import { LessonLayoutComponent } from './features/lessons/lesson-layout/lesson-layout.component';
import { inject } from '@angular/core';
import { LessonContent, LessonDetails } from './Core/api/api-models';
import { LessonService } from './features/lessons/lesson.service';
import { ContentHostComponent } from './features/lessons/content-host/content-host.component'; // <-- Import the new host component

// Resolver for the entire lesson object. (No changes here)
const lessonResolver: ResolveFn<LessonDetails | null> = (route: ActivatedRouteSnapshot) => {
  const lessonService = inject(LessonService);
  const lessonId = route.paramMap.get('lessonId');
  if (lessonId) {
    return lessonService.loadLessonById(lessonId);
  }
  return null;
};

// Resolver for a single piece of content. (No changes here)
const contentResolver: ResolveFn<LessonContent | undefined> = (route: ActivatedRouteSnapshot) => {
  const lesson = route.parent?.data['lesson'] as LessonDetails;
  const contentId = route.paramMap.get('contentId');
  return lesson?.contents.find(c => c.id === contentId);
};

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
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: (route) => {
              const lesson = route.data['lesson'] as LessonDetails;
              const firstContentId = lesson?.contents?.[0]?.id;
              return firstContentId ? `content/${firstContentId}` : '';
            }
          },
          {
            path: 'content/:contentId',
            // THE FIX: Statically load the ContentHostComponent.
            component: ContentHostComponent,
            resolve: {
              // The resolver provides the data that ContentHostComponent needs.
              content: contentResolver
            },
            // The complex loadComponent function is no longer needed here.
          }
        ]
      }
    ]
  },
];
