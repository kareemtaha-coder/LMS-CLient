import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { LessonContent, LessonDetails } from '../../Core/api/api-models';
import { ApiService } from '../../Core/api/api.service';

interface LessonState {
  lesson: LessonDetails | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
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

  public readonly selectedContent = signal<LessonContent | undefined>(undefined);

  // --- الإضافة الجديدة ---
  // Signal لتخزين معرف الدرس النشط حالياً
  public readonly activeLessonId = signal<string | null>(null);


  loadLessonById(id: string): Observable<LessonDetails | null> {
    this.#state.set({ lesson: null, loading: true, error: null });
    this.selectedContent.set(undefined);

    // --- التعديل الجديد ---
    // عند بدء تحميل درس جديد، قم بتحديث المعرف النشط فوراً
    this.activeLessonId.set(id);

    return this.apiService.get<LessonDetails>(`lessons/${id}`).pipe(
      tap(response => {
        this.#state.update(state => ({
          ...state,
          lesson: response,
          loading: false,
        }));
        if (response?.contents && response.contents.length > 0) {
          this.selectContent(response.contents[0]);
        }
      }),
      catchError(() => {
        this.#state.update(state => ({
          ...state,
          loading: false,
          error: 'Failed to load lesson details.'
        }));
        // If loading fails, clear the active lesson ID
        this.activeLessonId.set(null);
        return of(null);
      })
    );
  }

  public selectContent(content: LessonContent | undefined): void {
    this.selectedContent.set(content);
  }
}
