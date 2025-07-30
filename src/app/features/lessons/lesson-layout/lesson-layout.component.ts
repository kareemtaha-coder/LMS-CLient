import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core'; // أضف computed
import { CommonModule, NgClass } from '@angular/common';
import { LessonService } from '../lesson.service';
import { ContentHostComponent } from '../content-host/content-host.component';

@Component({
  selector: 'app-lesson-layout',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    ContentHostComponent,
  ],
  templateUrl: './lesson-layout.component.html',
  styleUrls: ['./lesson-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonLayoutComponent {
  protected lessonService = inject(LessonService);

  // --- الإضافة الجديدة: computed signals لنقل المنطق من القالب ---

  /** Checks if a previous content item exists. */
  protected hasPreviousContent = computed(() => {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return false;

    const currentIndex = lesson.contents.findIndex(c => c.id === currentId);
    return currentIndex > 0;
  });

  /** Checks if a next content item exists. */
  protected hasNextContent = computed(() => {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return false;

    const currentIndex = lesson.contents.findIndex(c => c.id === currentId);
    return currentIndex < lesson.contents.length - 1;
  });

  navigateToPreviousContent(): void {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return;

    const currentIndex = lesson.contents.findIndex(c => c.id === currentId);
    if (this.hasPreviousContent()) { // استخدام الـ computed signal هنا أيضًا
      this.lessonService.selectContent(lesson.contents[currentIndex - 1]);
    }
  }

  navigateToNextContent(): void {
    const lesson = this.lessonService.lesson();
    const currentId = this.lessonService.selectedContent()?.id;
    if (!lesson || !currentId) return;

    const currentIndex = lesson.contents.findIndex(c => c.id === currentId);
    if (this.hasNextContent()) { // استخدام الـ computed signal هنا أيضًا
      this.lessonService.selectContent(lesson.contents[currentIndex + 1]);
    }
  }
}
