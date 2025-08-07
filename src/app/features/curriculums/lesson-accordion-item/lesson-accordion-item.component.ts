import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { LessonContent, LessonSummary } from '../../../Core/api/api-models';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { LessonService } from '../../lessons/lesson.service';

@Component({
  selector: 'app-lesson-accordion-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './lesson-accordion-item.component.html',
  styleUrl: './lesson-accordion-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonAccordionItemComponent {
  // --- Inputs ---
  lesson = input.required<LessonSummary>();
  courseId = input.required<string>();
  chapterIndex = input.required<number>();
  lessonIndex = input.required<number>();
  showContents = signal(false);

  // --- Injected Services ---
  protected lessonService = inject(LessonService);
  private router = inject(Router);

  // --- Computed Signals ---
  // --- التعديل النهائي والحاسم ---
  // أصبح الآن يعتمد على Signal حقيقي من الخدمة، مما يجعله تفاعليًا
  isActive = computed(() => {
    // هل معرف الدرس النشط في الخدمة يطابق معرف هذا المكون؟
    return this.lessonService.activeLessonId() === this.lesson().id;
  });
    // --- New Method: Toggle Content Visibility ---
  toggleContent(): void {
    if (this.isActive()) {
      // If this is the active lesson, just toggle content visibility
      this.showContents.update(show => !show);
    } else {
      // If this is not the active lesson, navigate to it and show content
      this.navigateToLesson();
      this.showContents.set(true);
    }
  }

  navigateToLesson(): void {
    // لا داعي للتحقق من `isActive` هنا، الراوتر ذكي بما فيه الكفاية
    // لعدم إعادة التحميل إذا كان الرابط هو نفسه بالفعل.
    this.router.navigate(['/course', this.courseId(), 'lessons', this.lesson().id]);
  }

  onContentSelect(content: LessonContent): void {
    this.lessonService.selectContent(content);
  }
}
