import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { CourseLayoutComponent } from './features/course-layout/course-layout.component';
import { LessonLayoutComponent } from './features/lessons/lesson-layout/lesson-layout.component';
import { LessonDetails } from './Core/api/api-models';
import { LessonService } from './features/lessons/lesson.service';
import { inject } from '@angular/core';
const lessonResolver: ResolveFn<LessonDetails | null> = (route: ActivatedRouteSnapshot) => {
  const lessonService = inject(LessonService);
  const lessonId = route.paramMap.get('lessonId');
  if (lessonId) {
    return lessonService.loadLessonById(lessonId);
  }
  return null;
};
export const routes: Routes = [
  // ==================================================
  // #1: المسارات العامة (واجهة الطالب/الزائر)
  // ==================================================
  {
    // الصفحة الرئيسية التي تعرض قائمة المناهج المتاحة للتصفح
    path: 'curriculums',
    loadComponent: () => import('./features/curriculums/curriculum-list/curriculum-list.component').then(m => m.CurriculumListComponent)
  },
  {
    // التخطيط الخاص بعرض منهج معين ودروسه
    path: 'course/:id',
    component: CourseLayoutComponent,
    children: [
      {
        path: 'lessons/:lessonId',
        component: LessonLayoutComponent,
        resolve: { lesson: lessonResolver }
      },
      // مستقبلاً، يمكن إضافة توجيه تلقائي لأول درس في المنهج هنا
    ]
  },

  // ==================================================
  // #2: مسارات الإدارة (واجهة مدير المحتوى)
  // ==================================================
    {
    path: 'manage',
    children: [
      {
        // هذه هي صفحة الإدارة الرئيسية (Hub)
        // ستحتوي على نموذج الإنشاء وقائمة المناهج معًا
        path: 'curriculums',
        loadComponent: () => import('./features/curriculums/manage-curriculums-page/manage-curriculums-page/manage-curriculums-page.component').then(m => m.ManageCurriculumsPageComponent)
      },
      {
        // هذه هي صفحة "البنّاء" لمنهج معين لإدارة فصوله ودروسه
        path: 'curriculums/:id',
        loadComponent: () => import('./features/curriculums/curriculum-builder-page/curriculum-builder-page/curriculum-builder-page.component').then(m => m.CurriculumBuilderPageComponent)
      },
      // توجيه المسار الرئيسي /manage إلى صفحة إدارة المناهج
      { path: '', redirectTo: 'curriculums', pathMatch: 'full' }
      ,{
        path: 'lessons/:id',
        loadComponent: () => import('./features/lessons/lesson-builder-page/lesson-builder-page.component').then(m => m.LessonBuilderPageComponent),
      },
    ]
  },


  // ==================================================
  // #3: المسارات الافتراضية والبديلة
  // ==================================================
  { path: '', redirectTo: '/curriculums', pathMatch: 'full' },
  { path: '**', redirectTo: '/curriculums' } // أو يمكنك إنشاء مكون PageNotFoundComponent
];
