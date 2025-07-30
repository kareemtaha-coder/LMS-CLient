import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import {
  AddExampleItemRequest,
  AddExamplesGridRequest,
  AddImageRequest,
  AddRichTextRequest,
  AddVideoRequest,
  LessonContent,
  LessonDetails,
  ReorderContentsRequest,
} from '../../Core/api/api-models';
import { ApiService } from '../../Core/api/api.service';

interface LessonState {
  lesson: LessonDetails | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private apiService = inject(ApiService);

  #state = signal<LessonState>({
    lesson: null,
    loading: false,
    error: null,
  });

  public readonly lesson = () => this.#state().lesson;
  public readonly loading = () => this.#state().loading;
  public readonly error = () => this.#state().error;

  public readonly selectedContent = signal<LessonContent | undefined>(
    undefined
  );

  // --- الإضافة الجديدة ---
  // Signal لتخزين معرف الدرس النشط حالياً
  public readonly activeLessonId = signal<string | null>(null);

  // =======================================================
  // REVERTING THE CHANGE: The method now returns an Observable
  // =======================================================
  loadLessonById(id: string): Observable<LessonDetails | null> {
    this.#state.set({ lesson: null, loading: true, error: null });
    this.selectedContent.set(undefined);
    this.activeLessonId.set(id);

    return this.apiService.get<LessonDetails>(`lessons/${id}`).pipe(
      tap((response) => {
        this.#state.update((state) => ({
          ...state,
          lesson: response,
          loading: false,
        }));
        if (response?.contents && response.contents.length > 0) {
          this.selectContent(response.contents[0]);
        }
      }),
      catchError(() => {
        this.#state.update((state) => ({
          ...state,
          loading: false,
          error: 'Failed to load lesson details.',
        }));
        this.activeLessonId.set(null);
        return of(null);
      })
    ); // <-- REMOVED .subscribe() from here
  }

  public selectContent(content: LessonContent | undefined): void {
    this.selectedContent.set(content);
  }

  // ############ START: MODIFIED SECTION ############
  // سنقوم بإرجاع السلسلة بدلاً من الاشتراك فيها
  public addRichTextContent(
    lessonId: string,
    request: AddRichTextRequest
  ): Observable<LessonDetails | null> {
    return this.apiService
      .post<string>(`lessons/${lessonId}/contents/rich-text`, request)
      .pipe(
        switchMap(() => this.loadLessonById(lessonId)),
        catchError((err) => {
          console.error('Failed to add rich text content', err);
          this.#state.update((s) => ({
            ...s,
            loading: false,
            error: 'Failed to add content.',
          }));
          return of(null);
        })
      );
    //  <-- REMOVED .subscribe()
  }

  public reorderLessonContents(
    lessonId: string,
    orderedContentIds: string[]
  ): Observable<LessonDetails | null> {
    const request: ReorderContentsRequest = { orderedContentIds };
    return this.apiService
      .put(`lessons/${lessonId}/contents/reorder`, request)
      .pipe(
        switchMap(() => this.loadLessonById(lessonId)),
        catchError((err) => {
          console.error('Failed to reorder content', err);
          return of(null);
        })
      );
    //  <-- REMOVED .subscribe()
  }

  public addVideoContent(
    lessonId: string,
    request: AddVideoRequest & { sortOrder: number }
  ): Observable<LessonDetails | null> {
    // افترض أن هذا هو المسار الصحيح في الـ API
    return this.apiService
      .post<string>(`lessons/${lessonId}/contents/video`, request)
      .pipe(
        switchMap(() => this.loadLessonById(lessonId)),
        catchError((err) => {
          console.error('Failed to add video content', err);
          this.#state.update((s) => ({
            ...s,
            loading: false,
            error: 'Failed to add video.',
          }));
          return of(null);
        })
      );
  }

  public addImageContent(
    lessonId: string,
    request: AddImageRequest
  ): Observable<LessonDetails | null> {
    // We need to send FormData for file uploads
    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('caption', request.caption || '');
    formData.append('sortOrder', request.sortOrder.toString());
    formData.append('imageFile', request.imageFile);

    // Assumes your apiService can handle FormData
    return this.apiService
      .post<string>(`lessons/${lessonId}/contents/image-with-caption`, formData)
      .pipe(
        switchMap(() => this.loadLessonById(lessonId)),
        catchError((err) => {
          console.error('Failed to add image content', err);
          // Handle error state
          return of(null);
        })
      );
  }

  public addExamplesGridContent(lessonId: string, request: AddExamplesGridRequest): Observable<LessonDetails | null> {
  return this.apiService.post<string>(`lessons/${lessonId}/contents/examples-grid`, request)
    .pipe(
      switchMap(() => this.loadLessonById(lessonId)),
      catchError(err => {
        console.error('Failed to add examples grid', err);
        // Handle error state
        return of(null);
      })
    );
}
public addExampleItemToGrid(lessonId: string, gridContentId: string, request: AddExampleItemRequest): Observable<LessonDetails | null> {
  const formData = new FormData();
  formData.append('imageFile', request.imageFile);
  formData.append('audioFile', request.audioFile);

  // The API endpoint should accept the grid's content ID
  return this.apiService.post<string>(`lessons/${lessonId}/contents/examples-grid/${gridContentId}/items`, formData)
    .pipe(
      switchMap(() => this.loadLessonById(lessonId)),
      catchError(err => {
        console.error('Failed to add example item', err);
        return of(null);
      })
    );
}
}
