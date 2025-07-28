import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { LessonDetails } from '../../Core/api/api-models';
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

  loadLessonById(id: string): Observable<LessonDetails | null> {
    this.#state.set({ lesson: null, loading: true, error: null });

    return this.apiService.get<LessonDetails>(`lessons/${id}`).pipe(
      tap(response => this.#state.update(state => ({
        ...state,
        lesson: response,
        loading: false,
      }))),
      catchError(() => {
        this.#state.update(state => ({
          ...state,
          loading: false,
          error: 'Failed to load lesson details.'
        }));
        return of(null);
      })
    );
  }
}
