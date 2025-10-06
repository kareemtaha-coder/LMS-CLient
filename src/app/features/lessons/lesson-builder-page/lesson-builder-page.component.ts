import {
  ChangeDetectionStrategy, Component, effect, inject, input, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { LessonService } from '../lesson.service';
import {
  LessonContent,
  AddRichTextRequest,
  RichTextContent,
  AddVideoRequest,
  VideoContent,
  ImageWithCaptionContent,
  AddImageRequest,
  AddExamplesGridRequest,
  AddExampleItemRequest,
  UpdateRichTextRequest,
  UpdateVideoRequest,
  UpdateImageRequest,
  QuizContent
} from '../../../Core/api/api-models';
import { of, switchMap } from 'rxjs';

// Form & Display Components
import { AddRichTextFormComponent } from '../add-rich-text-form/add-rich-text-form.component';
import { RichTextContentComponent } from '../../lessons/components/rich-text-content/rich-text-content.component';
import { VideoContentComponent } from "../components/video-content/video-content.component";
import { AddVideoFormComponent } from "../add-video-form/add-video-form.component";
import { AddImageFormComponent, ImageFormSaveRequest } from '../add-image-form/add-image-form.component';
import { ImageWithCaptionContentComponent } from '../components/image-with-caption-content/image-with-caption-content.component';
import { AddExamplesGridFormComponent } from "../add-examples-grid-form/add-examples-grid-form.component";
import { ExamplesGridContentComponent } from "../components/examples-grid-content/examples-grid-content.component";
import { QuizContentComponent } from "../components/quiz-content.component";
import { ComprehensiveQuizComponent } from "../components/comprehensive-quiz/comprehensive-quiz.component";

@Component({
  selector: 'app-lesson-builder-page',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    AddRichTextFormComponent,
    RichTextContentComponent,
    VideoContentComponent,
    AddVideoFormComponent,
    AddImageFormComponent,
    ImageWithCaptionContentComponent,
    AddExamplesGridFormComponent,
    ExamplesGridContentComponent,
    QuizContentComponent,
    ComprehensiveQuizComponent
  ],
  templateUrl:'./lesson-builder-page.component.html' ,
  styleUrls: ['./lesson-builder-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonBuilderPageComponent {
  protected lessonService = inject(LessonService);
  id = input.required<string>();

  // --- State Signals ---
  protected editingContentId = signal<string | null>(null);
  protected addingContentType = signal<'RichText' | 'Video' | 'Image' | 'ExamplesGrid' | 'Quiz' | null>(null);
  protected addingAtIndex = signal<number | 'bottom'>('bottom');
  protected collapsedState = signal<Record<string, boolean>>({});
  protected contextualMenuOpenAtIndex = signal<number | null>(null);
  protected compactMode = signal(false);

  constructor() {
    effect(() => {
      this.lessonService.loadLessonById(this.id()).subscribe();
    });
  }

  toggleCompact(): void {
    const next = !this.compactMode();
    this.compactMode.set(next);
    if (next) this.collapseAll(); else this.expandAll();
  }

  // --- UI Helper Methods ---
  getAvatarClass(content: LessonContent): string {
    switch (content.contentType) {
      case 'RichText':
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 'Video':
        return 'bg-gradient-to-br from-red-400 to-red-600';
      case 'ImageWithCaption':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'ExamplesGrid':
        return 'bg-gradient-to-br from-purple-400 to-purple-600';
      default:
        return 'bg-gradient-to-br from-slate-400 to-slate-600';
    }
  }

  getContentIcon(content: LessonContent): string {
    switch (content.contentType) {
      case 'RichText': return 'T';
      case 'Video': return '▶';
      case 'ImageWithCaption': return '📷';
      case 'ExamplesGrid': return '⊞';
      default: return '?';
    }
  }

  getTypeTag(content: LessonContent): string {
    switch (content.contentType) {
      case 'RichText':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Video':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'ImageWithCaption':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'ExamplesGrid':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  }


  // --- Data Handlers for Forms ---

  getInitialDataFor(content: LessonContent): any | undefined {
    const { id, contentType, sortOrder, ...data } = content;
    return data;
  }

  handleSaveRichText(request: Omit<AddRichTextRequest, 'sortOrder'>): void {
    const lesson = this.lessonService.lesson();
    if (!lesson) return;
    const maxSortOrder = Math.max(0, ...lesson.contents.map((c) => c.sortOrder));
    const fullRequest = { ...request, sortOrder: maxSortOrder + 1 };
    this.addContentAndReorder(this.lessonService.addRichTextContent(this.id(), fullRequest), fullRequest);
  }

  handleSaveVideo(request: Omit<AddVideoRequest, 'sortOrder'>): void {
    const lesson = this.lessonService.lesson();
    if (!lesson) return;
    const maxSortOrder = Math.max(0, ...lesson.contents.map((c) => c.sortOrder));
    const fullRequest = { ...request, sortOrder: maxSortOrder + 1 };
    this.addContentAndReorder(this.lessonService.addVideoContent(this.id(), fullRequest), fullRequest);
  }

  handleSaveImage(request: ImageFormSaveRequest): void {
    const lesson = this.lessonService.lesson();
    if (!lesson) return;
    const maxSortOrder = Math.max(0, ...lesson.contents.map((c) => c.sortOrder));
    const fullRequest: AddImageRequest = { ...request, sortOrder: maxSortOrder + 1 };
    this.addContentAndReorder(this.lessonService.addImageContent(this.id(), fullRequest), fullRequest);
  }



  private addContentAndReorder(addObservable: any, fullRequest: { sortOrder: number }): void {
    const intendedIndex = this.addingAtIndex();
    this.addingContentType.set(null);

    addObservable.pipe(
      switchMap((updatedLesson: any) => {
        if (!updatedLesson || intendedIndex === 'bottom') {
          return of(updatedLesson);
        }
        const newContent = updatedLesson.contents.find((c: any) => c.sortOrder === fullRequest.sortOrder)!;
        const listWithoutNewItem = updatedLesson.contents.filter((c: any) => c.id !== newContent.id);
        const reorderedContents = [...listWithoutNewItem.slice(0, intendedIndex), newContent, ...listWithoutNewItem.slice(intendedIndex)];
        const orderedIds = reorderedContents.map((c: any) => c.id);
        return this.lessonService.reorderLessonContents(this.id(), orderedIds);
      })
    ).subscribe();
  }



  handleDeleteContent(contentId: string): void {
    if (confirm('هل أنت متأكد من رغبتك في حذف قطعة المحتوى هذه؟')) {
      console.log('Deleting content:', contentId);
    }
  }

  onContentDropped(event: CdkDragDrop<LessonContent[]>): void {
    const lesson = this.lessonService.lesson();
    if (!lesson?.contents || event.previousIndex === event.currentIndex) return;
    const reorderedContents = [...lesson.contents];
    moveItemInArray(reorderedContents, event.previousIndex, event.currentIndex);
    const orderedIds = reorderedContents.map((content) => content.id);
    this.lessonService.reorderLessonContents(this.id(), orderedIds).subscribe();
  }

  // --- UI State Management Methods ---

  openContextualMenu(index: number): void {
    this.addingContentType.set(null);
    this.contextualMenuOpenAtIndex.set(index);
  }

  showAddNewForm(type: 'RichText' | 'Video' | 'Image' | 'ExamplesGrid' | 'Quiz', index: number | 'bottom'): void {
    this.contextualMenuOpenAtIndex.set(null);
    this.addingContentType.set(type);
    this.addingAtIndex.set(index);
    this.editingContentId.set(null);
  }

  cancelAddNew(): void {
    this.addingContentType.set(null);
  }

  // --- Template Helper Methods ---

  getBorderClassForContent(content: LessonContent): string {
    switch (content.contentType) {
      case 'RichText':
        switch ((content as RichTextContent).noteType) {
          case 1: return 'border-l-blue-500';
          case 2: return 'border-l-amber-400';
          case 3: return 'border-l-teal-400';
          default: return 'border-l-slate-400';
        }
      case 'Video':
        return 'border-l-red-500';
      case 'ImageWithCaption':
        return 'border-l-green-500';
      case 'ExamplesGrid':
        return 'border-l-purple-500';
      case 'Quiz':
        return 'border-l-orange-500';
      default:
        return 'border-l-slate-400';
    }
  }
handleSaveExamplesGrid(request: Omit<AddExamplesGridRequest, 'sortOrder'>): void {
    const lesson = this.lessonService.lesson();
    if (!lesson) return;

    // FIXED: (TS7015) The index expression error is resolved by checking the type of addingAtIndex
    let sortOrder: number;
    const intendedIndex = this.addingAtIndex();
    if (intendedIndex === 'bottom' || lesson.contents.length === 0) {
      sortOrder = Math.max(0, ...lesson.contents.map((c) => c.sortOrder)) + 1;
    } else if (typeof intendedIndex === 'number' && lesson.contents[intendedIndex]) {
      // For contextual add, we take the sortOrder of the item at the index.
      // The re-ordering logic will place the new item correctly.
      sortOrder = lesson.contents[intendedIndex].sortOrder;
    } else {
      // Fallback for safety
      sortOrder = Math.max(0, ...lesson.contents.map((c) => c.sortOrder)) + 1;
    }

    // FIXED: (TS2345) The request now correctly includes the title
    const fullRequest: AddExamplesGridRequest = { ...request, sortOrder: sortOrder };
    this.addContentAndReorder(this.lessonService.addExamplesGridContent(this.id(), fullRequest), fullRequest);
  }

  handleSaveExampleItem(gridContentId: string, request: AddExampleItemRequest): void {
  console.log('1. [Component] Preparing to save item. Grid Content ID:', gridContentId);
  console.log('2. [Component] Request data:', request);

  // تأكد من وجود ملف الصورة على الأقل
  if (!request.imageFile) {
    console.error('Save aborted: Image file is missing.');
    return;
  }

  this.lessonService.addExampleItemToGrid(this.id(), gridContentId, request).subscribe({
    next: (updatedLesson) => {
      if (updatedLesson) {
        console.log('5. [Component] Success! Lesson has been updated.', updatedLesson);
      } else {
        console.warn('5. [Component] Call succeeded but the service returned null.');
      }
    },
    error: (err) => {
      console.error('5. [Component] An error occurred:', err);
      alert('فشل إضافة المثال. يرجى مراجعة الـ Console لمزيد من التفاصيل.');
    }
  });
}

/**
 * Handles the user's request to delete an example item.
 * It calls the corresponding method in LessonService to perform the action.
 * @param gridContentId The ID of the parent ExamplesGrid content.
 * @param itemId The ID of the item to be deleted.
 */
handleDeleteExampleItem(gridContentId: string, itemId: string): void {
  // 1. عرض رسالة تأكيد للمستخدم
  if (confirm('هل أنت متأكد من حذف هذا المثال؟')) {

    // 2. استدعاء الدالة من الخدمة
    this.lessonService.deleteExampleItem(gridContentId, itemId).subscribe({
      next: (updatedLesson) => {
        if (updatedLesson) {
          console.log(`تم حذف العنصر ${itemId} بنجاح.`);
          // لا حاجة لعمل أي شيء آخر هنا، فالخدمة قامت بتحديث الحالة بالفعل
        }
      },
      error: (err) => {
        console.error('حدث خطأ أثناء محاولة حذف العنصر.', err);
        // يمكنك هنا عرض رسالة خطأ للمستخدم
      }
    });
  }
}


  // NEW: Safely gets title for any content type
    getTitle(content: LessonContent): string {
      if (content.contentType === 'RichText' && (content as RichTextContent).title) {
          return String((content as RichTextContent).title);
      }
      if (content.contentType === 'Video' && (content as VideoContent).title) {
          return String((content as VideoContent).title);
      }
      return content.title ? String(content.title) : 'محتوى بدون عنوان';
  }

  isCollapsed(id: string): boolean { return this.collapsedState()[id] ?? false; }
  toggleCollapse(id: string): void { this.collapsedState.update(s => ({...s, [id]: !s[id]}));}
  collapseAll(): void {
    const allIds = this.lessonService.lesson()?.contents.map(c => c.id) ?? [];
    this.collapsedState.set(allIds.reduce((acc, id) => ({...acc, [id]: true}), {}));
  }
  expandAll(): void { this.collapsedState.set({}); }
  startEditing(contentId: string): void {
    this.collapsedState.update(s => { const n = {...s}; delete n[contentId]; return n; });
    this.editingContentId.set(contentId);
  }


  handleUpdateRichText(contentId: string, request: UpdateRichTextRequest): void {
  this.lessonService.updateRichTextContent(this.id(), contentId, request).subscribe({
    next: () => this.editingContentId.set(null), // Exit edit mode on success
    error: (err) => console.error("Update failed", err)
  });
}

handleUpdateVideo(contentId: string, request: UpdateVideoRequest): void {
  this.lessonService.updateVideoContent(this.id(), contentId, request).subscribe({
    next: () => this.editingContentId.set(null), // Exit edit mode on success
    error: (err) => console.error("Update failed", err)
  });
}

handleUpdateImage(contentId: string, request: UpdateImageRequest): void {
  this.lessonService.updateImageContent(this.id(), contentId, request).subscribe({
    next: () => this.editingContentId.set(null), // Exit edit mode on success
    error: (err) => console.error("Update failed", err)
  });
}

}
