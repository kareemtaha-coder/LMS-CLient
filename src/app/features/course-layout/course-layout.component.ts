import { Component, OnDestroy, OnInit, effect, inject, input, computed } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LayoutService } from '../../Core/layout/layout.service';
import { CurriculumService } from '../curriculums/curriculum.service';
import { CommonModule } from '@angular/common';
import { ChapterAccordionComponent } from '../curriculums/chapter-accordion/chapter-accordion.component';
// --- الإضافة الجديدة ---
import { LessonService } from '../lessons/lesson.service';

@Component({
  selector: 'app-course-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, ChapterAccordionComponent],
  templateUrl: './course-layout.component.html',
})
export class CourseLayoutComponent implements OnInit, OnDestroy {
  protected layoutService = inject(LayoutService);
  protected curriculumService = inject(CurriculumService);
  // --- الحقن الجديد ---
  protected lessonService = inject(LessonService);

  id = input.required<string>();
  isSidebarCollapsed = this.layoutService.isCourseSidebarCollapsed;

  // --- Signals for the new header ---
  courseTitle = computed(() => this.curriculumService.selectedCurriculum()?.title ?? 'Course');
  lessonTitle = computed(() => this.lessonService.lesson()?.title ?? 'Lesson');
  constructor() {
    effect(() => {
      this.curriculumService.loadCurriculumById(this.id());
    });
  }

  ngOnInit(): void {
    this.layoutService.hideAppSidebar();
  }

  ngOnDestroy(): void {
    this.layoutService.showAppSidebar();
  }
}
