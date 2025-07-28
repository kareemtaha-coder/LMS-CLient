import { ChangeDetectionStrategy, Component, input, signal, effect, inject } from '@angular/core';
import { ChapterWithLessons } from '../../../Core/api/api-models';
import { Router } from '@angular/router';
// Import the new lesson accordion component
import { LessonAccordionItemComponent } from '../lesson-accordion-item/lesson-accordion-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chapter-accordion',
  standalone: true,
  imports: [ CommonModule,LessonAccordionItemComponent], // <-- Use the new component
  templateUrl: './chapter-accordion.component.html',
  styleUrl: './chapter-accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterAccordionComponent {
  chapter = input.required<ChapterWithLessons>();
  chapterIndex = input.required<number>();
  courseId = input.required<string>();
  isOpen = signal(false);

  // We no longer need LessonService here
  private router = inject(Router);

  constructor() {
    // This effect now just checks if the URL contains a lesson from this chapter to auto-open
    effect(() => {
      const chapterData = this.chapter();
      if (chapterData.lessons.some(lesson => this.router.url.includes(lesson.id))) {
        this.isOpen.set(true);
      }
    });
  }

  toggle(): void {
    this.isOpen.update(open => !open);
  }
}
