import { ChangeDetectionStrategy, Component, HostListener, computed, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LessonService } from '../lesson.service';
import { ContentHostComponent } from '../content-host/content-host.component';

@Component({
  selector: 'app-lesson-layout',
  standalone: true,
  imports: [CommonModule, NgClass, ContentHostComponent],
  templateUrl: './lesson-layout.component.html',
  styleUrls: ['./lesson-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonLayoutComponent {
  protected lessonService = inject(LessonService);
  private route = inject(ActivatedRoute);

  protected currentIndex = computed(() => {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return -1;
    return lesson.contents.findIndex((c) => c.id === currentId);
  });

  protected totalSlides = computed(() => this.lessonService.lesson()?.contents.length ?? 0);
  protected slideIndices = computed(() => Array.from({ length: this.totalSlides() }, (_, i) => i));
  protected currentTitle = computed(() => {
    const content = this.lessonService.selectedContent();
    return content?.title ?? '';
  });

  constructor() {
    // Load lesson on route param change (replaces resolver)
    this.route.paramMap
      .pipe(
        map((p) => p.get('lessonId')),
        filter((id): id is string => !!id),
        switchMap((id) => this.lessonService.loadLessonById(id)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  // Checks if a previous content item exists.
  protected hasPreviousContent = computed(() => {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return false;
    const currentIndex = lesson.contents.findIndex((c) => c.id === currentId);
    return currentIndex > 0;
  });

  // Checks if a next content item exists.
  protected hasNextContent = computed(() => {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return false;
    const currentIndex = lesson.contents.findIndex((c) => c.id === currentId);
    return currentIndex < lesson.contents.length - 1;
  });

  navigateToIndex(index: number): void {
    const lesson = this.lessonService.lesson();
    if (!lesson) return;
    if (index < 0 || index >= lesson.contents.length) return;
    this.lessonService.selectContent(lesson.contents[index]);
  }

  navigateToPreviousContent(): void {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return;
    const currentIndex = lesson.contents.findIndex((c) => c.id === currentId);
    if (this.hasPreviousContent()) {
      this.lessonService.selectContent(lesson.contents[currentIndex - 1]);
    }
  }

  navigateToNextContent(): void {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return;
    const currentIndex = lesson.contents.findIndex((c) => c.id === currentId);
    if (this.hasNextContent()) {
      this.lessonService.selectContent(lesson.contents[currentIndex + 1]);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown' || ev.key === 'PageDown' || ev.key === ' ') {
      ev.preventDefault();
      this.navigateToNextContent();
    } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' || ev.key === 'PageUp') {
      ev.preventDefault();
      this.navigateToPreviousContent();
    }
  }

  private touchStartX = 0;
  private touchStartY = 0;
  onTouchStart(ev: TouchEvent): void {
    const t = ev.changedTouches[0];
    this.touchStartX = t.clientX;
    this.touchStartY = t.clientY;
  }
  onTouchEnd(ev: TouchEvent): void {
    const t = ev.changedTouches[0];
    const dx = t.clientX - this.touchStartX;
    const dy = t.clientY - this.touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < -40) this.navigateToNextContent();
      else if (dx > 40) this.navigateToPreviousContent();
    } else {
      if (dy > 60) this.navigateToNextContent();
      else if (dy < -60) this.navigateToPreviousContent();
    }
  }
}
