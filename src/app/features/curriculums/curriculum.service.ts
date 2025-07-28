import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../Core/api/api.service';
import { CurriculumDetails, CurriculumSummary } from '../../Core/api/api-models';
import { catchError, of, tap } from 'rxjs';

interface CurriculumState {
  curriculums: CurriculumSummary[];
  selectedCurriculum: CurriculumDetails | null; // <-- Add this
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {

  private apiService = inject(ApiService);

  // A private signal to hold the state
  #state = signal<CurriculumState>({
    curriculums: [],
    selectedCurriculum: null, // <-- Initialize here
    loading: false,
    error: null,
  });

  // Public computed signal for the selected curriculum
  public readonly selectedCurriculum = () => this.#state().selectedCurriculum;

  // Public computed signals for components to consume
  public readonly curriculums = () => this.#state().curriculums;
  public readonly loading = () => this.#state().loading;
  public readonly error = () => this.#state().error;

  constructor() {
    this.loadCurriculums();
  }

  private loadCurriculums(): void {
    this.#state.update(state => ({ ...state, loading: true }));

    this.apiService.get<CurriculumSummary[]>('curriculums').pipe(
      tap(response => this.#state.update(state => ({
        ...state,
        curriculums: response,
        loading: false,
      }))),
      catchError(err => {
        this.#state.update(state => ({
          ...state,
          loading: false,
          error: 'Failed to load curriculums.'
        }));
        return of(null); // Return a safe observable
      })
    ).subscribe();
  }
  // NEW METHOD to load a single curriculum by its ID
  public loadCurriculumById(id: string): void {
    this.#state.update(state => ({ ...state, loading: true, selectedCurriculum: null }));

    this.apiService.get<CurriculumDetails>(`curriculums/${id}`).pipe(
      tap(response => this.#state.update(state => ({
        ...state,
        selectedCurriculum: response,
        loading: false,
      }))),
      catchError(err => {
        this.#state.update(state => ({
          ...state,
          loading: false,
          error: 'Failed to load the curriculum details.'
        }));
        return of(null);
      })
    ).subscribe();
  }

}
