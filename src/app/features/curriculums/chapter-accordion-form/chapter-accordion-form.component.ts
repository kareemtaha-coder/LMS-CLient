import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { ChapterWithLessons } from '../../../Core/api/api-models';
import { AddLessonFormComponent } from "../../lessons/add-lesson-form/add-lesson-form.component";
import { InlineEditComponent } from "../../../shared/ui/inline-edit/inline-edit.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chapter-accordion-form',
  imports: [AddLessonFormComponent, InlineEditComponent,CommonModule,RouterLink],
  templateUrl: './chapter-accordion-form.component.html',
  styleUrl: './chapter-accordion-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterAccordionFormComponent {
 // المدخلات من المكون الأب
  chapter = input.required<ChapterWithLessons>();
  isExpanded = input.required<boolean>();
  // --- مخرجات جديدة لحذف وتعديل الدرس ---
  @Output() deleteLesson = new EventEmitter<string>(); // سترسل lessonId
  @Output() updateLesson = new EventEmitter<{lessonId: string, newTitle: string}>();
  @Output() setLessonStatus = new EventEmitter<{ lessonId: string, isPublished: boolean }>();
  // المخرجات (الأحداث التي يرسلها للاب)
  @Output() toggle = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() updateTitle = new EventEmitter<string>();
  @Output() addLesson = new EventEmitter<string>();

  // دوال بسيطة لإرسال الأحداث للأعلى
  onTitleSave(newTitle: string): void {
    this.updateTitle.emit(newTitle);
  }

  onLessonSave(newTitle: string): void {
    this.addLesson.emit(newTitle);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation(); // منع فتح الأكورديون عند الضغط على الحذف
    this.delete.emit();
  }

  onToggle(): void {
    this.toggle.emit();
  }
   onDeleteLesson(lessonId: string): void {
    this.deleteLesson.emit(lessonId);
  }

  onUpdateLesson(newTitle: string, lessonId: string): void {
    this.updateLesson.emit({ lessonId, newTitle });
  }
   onSetLessonStatus(lessonId: string, isPublished: boolean): void {
    this.setLessonStatus.emit({ lessonId, isPublished });
  }
}
