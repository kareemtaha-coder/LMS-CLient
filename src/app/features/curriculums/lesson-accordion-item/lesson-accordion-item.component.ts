import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { LessonSummary } from '../../../Core/api/api-models';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { LessonService } from '../../lessons/lesson.service';

@Component({
  selector: 'app-lesson-accordion-item',
  imports: [RouterLink, RouterLinkActive, NgClass],
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

  // --- Injected Services ---
  protected lessonService = inject(LessonService);
  private router = inject(Router);

  // --- State ---
  isOpen = signal(false);

  // --- Computed Signals ---
  // Check if this lesson is the currently active one in the main view
  isActive = computed(() => {
    return this.router.url.includes(`/lessons/${this.lesson().id}`);
  });

  constructor() {
    // Effect to auto-open this accordion if it becomes the active lesson
    effect(() => {
      if (this.isActive()) {
        this.isOpen.set(true);
      }
    });
  }

  // --- Methods ---
  toggle(): void {
    // If it's already active, toggling just opens/closes the content list.
    // If it's not active, toggling will also navigate to it.
    if (!this.isActive()) {
      this.router.navigate(['/course', this.courseId(), 'lessons', this.lesson().id]);
    }
    this.isOpen.update(open => !open);
  }
}
