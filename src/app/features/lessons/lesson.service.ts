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
  ExamplesGridContent,
  UpdateImageRequest,
  UpdateVideoRequest,
  VideoContent,
  RichTextContent,
  UpdateRichTextRequest,
  AddQuizRequest,
  AddQuestionRequest,
  AddAnswerRequest,
  UpdateQuizSettingsRequest,
  QuizContent,
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

  public addExamplesGridContent(
    lessonId: string,
    request: AddExamplesGridRequest
  ): Observable<LessonDetails | null> {
    return this.apiService
      .post<string>(`lessons/${lessonId}/contents/examples-grid`, request)
      .pipe(
        switchMap(() => this.loadLessonById(lessonId)),
        catchError((err) => {
          console.error('Failed to add examples grid', err);
          // Handle error state
          return of(null);
        })
      );
  }

  /**
   * Deletes a single example item from a grid.
   * [cite_start]This corresponds to the API endpoint: DELETE /api/example-items/{itemId} [cite: 266]
   * @param gridContentId The ID of the parent grid content block (for state update).
   * @param itemId The ID of the example item to delete.
   * @returns An observable of the updated lesson details or null on error.
   */
  public deleteExampleItem(
    gridContentId: string,
    itemId: string
  ): Observable<LessonDetails | null> {
    return this.apiService
      .delete(`contents/${gridContentId}/example-items/${itemId}`)
      .pipe(
        tap(() => {
          // Optimistically update local state for better performance
          const currentLesson = this.#state().lesson;
          if (currentLesson) {
            const updatedContents = currentLesson.contents.map((content) => {
              // Find the correct grid by its ID
              if (
                content.id === gridContentId &&
                content.contentType === 'ExamplesGrid'
              ) {
                const grid = content as ExamplesGridContent;
                // Filter out the deleted item from the array
                const updatedItems = grid.exampleItems.filter(
                  (item) => item.id !== itemId
                );
                // Return the updated grid content
                return { ...grid, exampleItems: updatedItems };
              }
              return content;
            });
            // Set the new state with the updated contents
            this.#state.update((s) => ({
              ...s,
              lesson: { ...currentLesson, contents: updatedContents },
            }));
          }
        }),
        // Return the updated lesson from the state to the component
        switchMap(() => of(this.#state().lesson)),
        catchError((err) => {
          console.error(`Failed to delete example item ${itemId}`, err);
          return of(null);
        })
      );
  }

  public addExampleItemToGrid(
    lessonId: string,
    gridContentId: string,
    request: AddExampleItemRequest
  ): Observable<LessonDetails | null> {
    const formData = new FormData();
    formData.append('imageFile', request.imageFile);

    if (request.audioFile) {
      formData.append('audioFile', request.audioFile);
    }

    const endpoint = `contents/${gridContentId}/example-items`;

    console.log('3. [Service] Calling API endpoint:', endpoint);
    console.log('4. [Service] Sending FormData:', formData);
    // لطباعة محتويات FormData
    for (let [key, value] of formData.entries()) {
      console.log(`   - ${key}:`, value);
    }

    return this.apiService.post<string>(endpoint, formData).pipe(
      switchMap((response) => {
        console.log(
          '[Service] API call successful, response (new item ID):',
          response
        );
        // إعادة تحميل الدرس بالكامل لتحديث الواجهة بالبيانات الجديدة
        return this.loadLessonById(lessonId);
      }),
      catchError((err) => {
        console.error('[Service] API call failed.', err);
        return of(null);
      })
    );
  }
/**
 * Updates an existing Rich Text content block.
 */
public updateRichTextContent(lessonId: string, contentId: string, request: UpdateRichTextRequest): Observable<LessonDetails | null> {
  const endpoint = `lessons/${lessonId}/contents/${contentId}/rich-text`;
  return this.apiService.put(endpoint, request).pipe(
    tap(() => {
      const lesson = this.#state().lesson;
      if (lesson) {
        const updatedContents = lesson.contents.map(content => {
          if (content.id === contentId && content.contentType === 'RichText') {
            // Destructure the request to separate the title string
            const { title, ...restOfRequest } = request;
            // Reconstruct the object, creating the correct title structure
            return {
              ...content,
              ...restOfRequest,
              title // FIXED: Create the ContentTitle object
            };
          }
          return content;
        });
        this.#state.update(s => ({ ...s, lesson: { ...lesson, contents: updatedContents } }));
      }
    }),
    switchMap(() => of(this.#state().lesson)),
    catchError(err => {
      console.error('Failed to update rich text content', err);
      return of(null);
    })
  );
}

/**
 * Updates an existing Video content block.
 */
public updateVideoContent(lessonId: string, contentId: string, request: UpdateVideoRequest): Observable<LessonDetails | null> {
  const endpoint = `lessons/${lessonId}/contents/${contentId}/video`;
  return this.apiService.put(endpoint, request).pipe(
    tap(() => {
      const lesson = this.#state().lesson;
      if (lesson) {
        const updatedContents = lesson.contents.map(content => {
          if (content.id === contentId && content.contentType === 'Video') {
            // Destructure the request to separate the title string
            const { title, ...restOfRequest } = request;
            // Reconstruct the object, creating the correct title structure
            return {
              ...content,
              ...restOfRequest,
              title: title  // FIXED: Create the ContentTitle object
            };
          }
          return content;
        });
        this.#state.update(s => ({ ...s, lesson: { ...lesson, contents: updatedContents } }));
      }
    }),
    switchMap(() => of(this.#state().lesson)),
    catchError(err => {
      console.error('Failed to update video content', err);
      return of(null);
    })
  );
}
/**
 * Updates an existing Image with Caption content block.
 * Reloads the lesson on success to get the new image URL.
 */
public updateImageContent(lessonId: string, contentId: string, request: UpdateImageRequest): Observable<LessonDetails | null> {
  const endpoint = `lessons/${lessonId}/contents/${contentId}/image-with-caption`;
  const formData = new FormData();
  formData.append('Title', request.title);
  formData.append('Caption', request.caption);
  if (request.imageFile) {
    formData.append('ImageFile', request.imageFile);
  }

  return this.apiService.put(endpoint, formData).pipe(
    // Reload the whole lesson to get the potentially new imageUrl
    switchMap(() => this.loadLessonById(lessonId)),
    catchError(err => {
      console.error('Failed to update image content', err);
      return of(null);
    })
  );
}

// =================================================================
// #region Quiz Management Methods
// =================================================================

/**
 * Adds a new quiz content block to a lesson.
 */
public addQuizContent(lessonId: string, request: AddQuizRequest): Observable<LessonDetails | null> {
  return this.apiService
    .post<string>(`Quiz/lessons/${lessonId}/quiz`, request)
    .pipe(
      switchMap(() => this.loadLessonById(lessonId)),
      catchError((err) => {
        console.error('Failed to add quiz content', err);
        this.#state.update((s) => ({
          ...s,
          loading: false,
          error: 'Failed to add quiz content.',
        }));
        return of(null);
      })
    );
}

/**
 * Adds a new question to an existing quiz.
 */
public addQuestionToQuiz(quizContentId: string, request: AddQuestionRequest): Observable<LessonDetails | null> {
  return this.apiService
    .post<string>(`Quiz/quiz/${quizContentId}/questions`, request)
    .pipe(
      switchMap(() => {
        const lessonId = this.activeLessonId();
        return lessonId ? this.loadLessonById(lessonId) : of(null);
      }),
      catchError((err) => {
        console.error('Failed to add question to quiz', err);
        return of(null);
      })
    );
}

/**
 * Adds a new answer to an existing question.
 */
public addAnswerToQuestion(questionId: string, request: AddAnswerRequest): Observable<LessonDetails | null> {
  return this.apiService
    .post<string>(`Quiz/questions/${questionId}/answers`, request)
    .pipe(
      switchMap(() => {
        const lessonId = this.activeLessonId();
        return lessonId ? this.loadLessonById(lessonId) : of(null);
      }),
      catchError((err) => {
        console.error('Failed to add answer to question', err);
        return of(null);
      })
    );
}

/**
 * Updates quiz settings (time limit, passing score, etc.).
 */
public updateQuizSettings(quizContentId: string, request: UpdateQuizSettingsRequest): Observable<LessonDetails | null> {
  return this.apiService
    .put(`Quiz/quiz/${quizContentId}/settings`, request)
    .pipe(
      switchMap(() => {
        const lessonId = this.activeLessonId();
        return lessonId ? this.loadLessonById(lessonId) : of(null);
      }),
      catchError((err) => {
        console.error('Failed to update quiz settings', err);
        return of(null);
      })
    );
}
}
