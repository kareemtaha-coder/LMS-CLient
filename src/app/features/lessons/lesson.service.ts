import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
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
  QuizContent,
  CreateComprehensiveQuizRequest,
  UpdateComprehensiveQuizRequest,
  QuizContentResponse,
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
  private http = inject(HttpClient);
  private apiUrl = 'https://almehrab.runasp.net/api';

  #state = signal<LessonState>({
    lesson: null,
    loading: false,
    error: null,
  });

  public readonly lesson = () => this.#state().lesson;
  public readonly loading = () => this.#state().loading;
  public readonly error = () => this.#state().error;
  public readonly lessonState = () => this.#state();

  public readonly selectedContent = signal<LessonContent | undefined>(
    undefined
  );

  // --- الإضافة الجديدة ---
  // Signal لتخزين معرف الدرس النشط حالياً
  public readonly activeLessonId = signal<string | null>(null);

  // =======================================================
  // REVERTING THE CHANGE: The method now returns an Observable
  // =======================================================
  loadLesson(id: string): Observable<LessonDetails | null> {
    return this.loadLessonById(id);
  }

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
      catchError((error) => {
        console.error('Error loading lesson:', error);
        let errorMessage = 'Failed to load lesson details.';

        if (error.status === 404) {
          errorMessage = 'Lesson not found.';
        } else if (error.status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else if (error.status === 0) {
          errorMessage = 'Network error. Please check your connection.';
        }

        this.#state.update((state) => ({
          ...state,
          loading: false,
          error: errorMessage,
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
          let errorMessage = 'Failed to add content.';

          if (err.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          }

          this.#state.update((s) => ({
            ...s,
            loading: false,
            error: errorMessage,
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
          let errorMessage = 'Failed to reorder content.';

          if (err.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          }

          this.#state.update((s) => ({
            ...s,
            loading: false,
            error: errorMessage,
          }));
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
          let errorMessage = 'Failed to add video.';

          if (err.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          }

          this.#state.update((s) => ({
            ...s,
            loading: false,
            error: errorMessage,
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
          let errorMessage = 'Failed to add image.';

          if (err.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          }

          this.#state.update((s) => ({
            ...s,
            loading: false,
            error: errorMessage,
          }));
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
          let errorMessage = 'Failed to add examples grid.';

          if (err.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          }

          this.#state.update((s) => ({
            ...s,
            loading: false,
            error: errorMessage,
          }));
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
          let errorMessage = 'Failed to delete example item.';

          if (err.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          }

          this.#state.update((s) => ({
            ...s,
            loading: false,
            error: errorMessage,
          }));
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
        let errorMessage = 'Failed to add example item.';

        if (err.status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else if (err.status === 0) {
          errorMessage = 'Network error. Please check your connection.';
        }

        this.#state.update((s) => ({
          ...s,
          loading: false,
          error: errorMessage,
        }));
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
      let errorMessage = 'Failed to update rich text content.';

      if (err.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      }

      this.#state.update((s) => ({
        ...s,
        loading: false,
        error: errorMessage,
      }));
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
      let errorMessage = 'Failed to update video content.';

      if (err.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      }

      this.#state.update((s) => ({
        ...s,
        loading: false,
        error: errorMessage,
      }));
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
      let errorMessage = 'Failed to update image content.';

      if (err.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      }

      this.#state.update((s) => ({
        ...s,
        loading: false,
        error: errorMessage,
      }));
      return of(null);
    })
  );
}

// =================================================================
// #region Comprehensive Quiz Methods
// =================================================================

  /**
   * إنشاء كويز شامل مع الأسئلة والإجابات في endpoint واحد
   */
  createComprehensiveQuiz(lessonId: string, request: CreateComprehensiveQuizRequest): Observable<QuizContentResponse> {
    return this.http.post<QuizContentResponse>(`${this.apiService.baseUrl}/QuizComprehensive/lessons/${lessonId}/quiz-comprehensive`, request)
      .pipe(
        tap(() => {
          // إعادة تحميل الدرس بعد إنشاء الكويز
          this.loadLesson(lessonId).subscribe();
        }),
        catchError(error => {
          console.error('Error creating comprehensive quiz:', error);
          if (error.status === 400) {
            return throwError(() => new Error('بيانات غير صحيحة. تحقق من المدخلات'));
          } else if (error.status === 404) {
            return throwError(() => new Error('الدرس غير موجود'));
          } else if (error.status === 500) {
            return throwError(() => new Error('خطأ في الخادم. يرجى المحاولة مرة أخرى'));
          } else if (error.status === 0) {
            return throwError(() => new Error('خطأ في الاتصال. تحقق من اتصالك بالإنترنت'));
          }
          return throwError(() => new Error('فشل في إنشاء الاختبار'));
        })
      );
  }

  /**
   * تحديث كويز شامل مع الأسئلة والإجابات
   */
  updateComprehensiveQuiz(quizContentId: string, request: UpdateComprehensiveQuizRequest): Observable<QuizContentResponse> {
    return this.http.put<QuizContentResponse>(`${this.apiService.baseUrl}/api/QuizComprehensive/quiz/${quizContentId}/comprehensive`, request)
      .pipe(
        tap(() => {
          // إعادة تحميل الدرس بعد تحديث الكويز
          const lessonId = this.lessonState().lesson?.id;
          if (lessonId) {
            this.loadLesson(lessonId).subscribe();
          }
        }),
        catchError(error => {
          console.error('Error updating comprehensive quiz:', error);
          if (error.status === 400) {
            return throwError(() => new Error('بيانات غير صحيحة. تحقق من المدخلات'));
          } else if (error.status === 404) {
            return throwError(() => new Error('الاختبار غير موجود'));
          } else if (error.status === 500) {
            return throwError(() => new Error('خطأ في الخادم. يرجى المحاولة مرة أخرى'));
          } else if (error.status === 0) {
            return throwError(() => new Error('خطأ في الاتصال. تحقق من اتصالك بالإنترنت'));
          }
          return throwError(() => new Error('فشل في تحديث الاختبار'));
        })
      );
  }

  /**
   * حذف كويز بالكامل
   */
  deleteQuiz(quizContentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.baseUrl}/api/QuizComprehensive/quiz/${quizContentId}`)
      .pipe(
        tap(() => {
          // إعادة تحميل الدرس بعد حذف الكويز
          const lessonId = this.lessonState().lesson?.id;
          if (lessonId) {
            this.loadLesson(lessonId).subscribe();
          }
        }),
        catchError(error => {
          console.error('Error deleting quiz:', error);
          if (error.status === 404) {
            return throwError(() => new Error('الاختبار غير موجود'));
          } else if (error.status === 500) {
            return throwError(() => new Error('خطأ في الخادم. يرجى المحاولة مرة أخرى'));
          } else if (error.status === 0) {
            return throwError(() => new Error('خطأ في الاتصال. تحقق من اتصالك بالإنترنت'));
          }
          return throwError(() => new Error('فشل في حذف الاختبار'));
        })
      );
  }

  /**
   * الحصول على كويز مع جميع أسئلته وإجاباته
   */
  getComprehensiveQuiz(quizContentId: string): Observable<QuizContentResponse> {
    return this.http.get<QuizContentResponse>(`${this.apiService.baseUrl}/api/QuizComprehensive/quiz/${quizContentId}/comprehensive`)
      .pipe(
        catchError(error => {
          console.error('Error getting comprehensive quiz:', error);
          if (error.status === 404) {
            return throwError(() => new Error('الاختبار غير موجود'));
          } else if (error.status === 500) {
            return throwError(() => new Error('خطأ في الخادم. يرجى المحاولة مرة أخرى'));
          } else if (error.status === 0) {
            return throwError(() => new Error('خطأ في الاتصال. تحقق من اتصالك بالإنترنت'));
          }
          return throwError(() => new Error('فشل في تحميل الاختبار'));
        })
      );
  }
}
