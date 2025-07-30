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
  AddExampleItemRequest
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

@Component({
  selector: 'app-lesson-builder-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DragDropModule,
    AddRichTextFormComponent,
    RichTextContentComponent,
    VideoContentComponent,
    AddVideoFormComponent,
    AddImageFormComponent,
    ImageWithCaptionContentComponent,
    AddExamplesGridFormComponent,
    ExamplesGridContentComponent
],
  templateUrl: './lesson-builder-page.component.html',
  styleUrls: ['./lesson-builder-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonBuilderPageComponent {
  protected lessonService = inject(LessonService);
  id = input.required<string>();

  // --- State Signals ---
  protected editingContentId = signal<string | null>(null);
protected addingContentType = signal<'RichText' | 'Video' | 'Image' | 'ExamplesGrid' | null>(null);
  protected addingAtIndex = signal<number | 'bottom'>('bottom');
  protected collapsedState = signal<Record<string, boolean>>({});
  protected contextualMenuOpenAtIndex = signal<number | null>(null);

  constructor() {
    effect(() => {
      this.lessonService.loadLessonById(this.id()).subscribe();
    });
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

handleSaveExamplesGrid(request: Omit<AddExamplesGridRequest, 'sortOrder'>): void {
  const lesson = this.lessonService.lesson();
  if (!lesson) return;
  const maxSortOrder = Math.max(0, ...lesson.contents.map((c) => c.sortOrder));
  const fullRequest = { ...request, sortOrder: maxSortOrder + 1 };
  this.addContentAndReorder(this.lessonService.addExamplesGridContent(this.id(), fullRequest), fullRequest);
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

  // --- Update & Delete Handlers ---

  handleUpdateRichText(contentId: string, request: Omit<AddRichTextRequest, 'sortOrder'>): void {
    console.log('Updating RichText:', contentId, request);
    this.editingContentId.set(null);
  }

  handleUpdateVideo(contentId: string, request: Omit<AddVideoRequest, 'sortOrder'>): void {
    console.log('Updating Video:', contentId, request);
    this.editingContentId.set(null);
  }

  handleUpdateImage(contentId: string, request: ImageFormSaveRequest): void {
    console.log('Updating Image:', contentId, request);
    this.editingContentId.set(null);
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

  showAddNewForm(type: 'RichText' | 'Video' | 'Image' | 'ExamplesGrid', index: number | 'bottom'): void {
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
      default:
        return 'border-l-slate-400';
    }
  }
  // NEW: Handler to save a single example item to an existing grid
  handleSaveExampleItem(gridContentId: string, request: AddExampleItemRequest): void {
    this.lessonService.addExampleItemToGrid(this.id(), gridContentId, request).subscribe();
  }

  // NEW: Handler to delete a single example item
  handleDeleteExampleItem(gridContentId: string, itemId: string): void {
    if(confirm('هل أنت متأكد من حذف هذا المثال؟')) {
      // Call your service method here
      // e.g., this.lessonService.deleteExampleItem(this.id(), gridContentId, itemId).subscribe();
      console.log(`Deleting item ${itemId} from grid ${gridContentId}`);
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

}
