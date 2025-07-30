import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CurriculumService } from '../../curriculum.service';
import { AddChapterRequest, AddLessonRequest, ChapterWithLessons, UpdateChapterRequest } from '../../../../Core/api/api-models';
import { AddChapterFormComponent } from '../../add-chapter-form/add-chapter-form.component';
import { InlineEditComponent } from "../../../../shared/ui/inline-edit/inline-edit.component";
import { ConfirmationDialogComponent } from "../../../../shared/ui/confirmation-dialog/confirmation-dialog.component";
import { AddLessonFormComponent } from "../../../lessons/add-lesson-form/add-lesson-form.component";
import { ChapterAccordionComponent } from "../../chapter-accordion/chapter-accordion.component";
import { ChapterAccordionFormComponent } from "../../chapter-accordion-form/chapter-accordion-form.component";
@Component({
  selector: 'app-curriculum-builder-page',
  standalone: true,
  imports: [CommonModule, RouterLink, AddChapterFormComponent, InlineEditComponent, ConfirmationDialogComponent, AddLessonFormComponent, ChapterAccordionComponent, ChapterAccordionFormComponent],
    templateUrl: './curriculum-builder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurriculumBuilderPageComponent {
  // ✅ الصحيح: المكون يحتوي على 'curriculumService' للوصول إلى البيانات.
  // لا توجد خاصية اسمها 'curriculum' هنا.
  protected curriculumService = inject(CurriculumService);
  // --- Signals جديدة للتحكم في نافذة الحذف ---
  protected showDeleteConfirmation = signal(false);

  protected chapterToDelete = signal<ChapterWithLessons | null>(null);
  id = input.required<string>();
  protected itemToDelete = signal<{id: string, title: string} | null>(null);
  private nextSortOrder = computed(() => {
    const curriculum = this.curriculumService.selectedCurriculum();
    return (curriculum?.chapters?.length ?? 0) + 1;
  });

  constructor() {
    effect(() => {
      this.curriculumService.loadCurriculumById(this.id());
    });
  }

  // =======================================================
  // المنطق الجديد والمحسّن لإضافة فصل
  // =======================================================
  handleAddChapter(title: string): void {
    const chapters = this.curriculumService.selectedCurriculum()?.chapters ?? [];

    // 1. جد أكبر قيمة لـ sortOrder موجودة حاليًا
    const maxSortOrder = chapters.reduce(
      (max, chapter) => (chapter.sortOrder > max ? chapter.sortOrder : max),
      0
    );

    // 2. قم بإنشاء الطلب مع قيمة sortOrder الجديدة (أكبر قيمة + 1)
    const request: AddChapterRequest = {
      title: title,
      sortOrder: maxSortOrder + 1,
    };

    this.curriculumService.addChapter(this.id(), request);
  }

    handleUpdateChapter(newTitle: string, chapterId: string): void {
    const request: UpdateChapterRequest = { title: newTitle };
    this.curriculumService.updateChapter(this.id(), chapterId, request);
  }


  // 3. عند إلغاء الحذف أو إغلاق النافذة
  closeConfirmationDialog(): void {
    this.showDeleteConfirmation.set(false);
    this.chapterToDelete.set(null);
  }
  protected expandedChapterId = signal<string | null>(null);
  // دالة لفتح وإغلاق الفصل
  toggleChapter(chapterId: string): void {
    this.expandedChapterId.update(currentId =>
      currentId === chapterId ? null : chapterId
    );
  }

    handleDeleteLesson(lessonId: string): void {
    const curriculum = this.curriculumService.selectedCurriculum();
    const lesson = curriculum?.chapters
      .flatMap((c) => c.lessons)
      .find((l) => l.id === lessonId);
    if (lesson) {
      this.promptDeleteItem(lesson);
    }
  }

  promptDeleteItem(item: { id: string; title: string }): void {
    this.itemToDelete.set(item);
    this.showDeleteConfirmation.set(true);
  }

  handleConfirmDelete(): void {
    const item = this.itemToDelete();
    const curriculum = this.curriculumService.selectedCurriculum();
    if (!item || !curriculum) {
      this.closeConfirmationDialog();
      return;
    }

    const isChapter = curriculum.chapters.some((c) => c.id === item.id);

    if (isChapter) {
      this.curriculumService.deleteChapter(this.id(), item.id);
    } else {
      this.curriculumService.deleteLesson(this.id(), item.id);
    }
    this.closeConfirmationDialog();
  }

    // دالة للتعامل مع حدث إضافة درس جديد
  handleAddLesson(title: string, chapterId: string, lessonsCount: number): void {
    const request: AddLessonRequest = {
      title: title,
     sortOrder: lessonsCount + 1 // [cite: 119-120]
    };
    this.curriculumService.addLesson(this.id(), chapterId, request);
  }

   // --- دالة جديدة للتعامل مع حدث تغيير حالة الدرس ---
  handleSetLessonStatus(event: { lessonId: string, isPublished: boolean }): void {
    if (event.isPublished) {
      this.curriculumService.publishLesson(this.id(), event.lessonId);
    } else {
      this.curriculumService.unpublishLesson(this.id(), event.lessonId);
    }
  }
}
