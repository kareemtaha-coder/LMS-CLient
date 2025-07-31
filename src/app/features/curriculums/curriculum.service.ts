import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../Core/api/api.service';
import { AddChapterRequest, AddLessonRequest, AddRichTextLessonRequest, CreateCurriculumRequest, CurriculumDetails, CurriculumSummary, UpdateChapterRequest, UpdateLessonTitleRequest } from '../../Core/api/api-models';
import { catchError, finalize, firstValueFrom, of, tap } from 'rxjs';

interface CurriculumState {
  curriculums: CurriculumSummary[];
  selectedCurriculum: CurriculumDetails | null; // <-- Add this
  loading: boolean;
  error: string | null;
  actionError: string | null;
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
     actionError: null
  });



  // Public computed signal for the selected curriculum
  public readonly selectedCurriculum = () => this.#state().selectedCurriculum;

  // Public computed signals for components to consume
  public readonly curriculums = () => this.#state().curriculums;
  public readonly loading = () => this.#state().loading;
  public readonly error = () => this.#state().error;
  public readonly actionError = () => this.#state().actionError;

    public readonly creating = signal<boolean>(false);
  public readonly createError = signal<string | null>(null);

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
  public createCurriculum(request: CreateCurriculumRequest): void {
    this.creating.set(true);
    this.createError.set(null);

    this.apiService.post<string>('curriculums', request).pipe(
      tap(() => {
        // عند النجاح، قم بإعادة تحميل القائمة لتظهر النتيجة فوراً
        this.loadCurriculums();
      }),
      catchError(err => {
        // يمكنك هنا التعامل مع تفاصيل الخطأ القادم من الـ API
        this.createError.set('فشل إنشاء المنهج. الرجاء التحقق من البيانات.');
        return of(null);
      }),
      finalize(() => {
        // هذا سيتم تنفيذه دائماً سواء نجح الطلب أو فشل
        this.creating.set(false);
      })
    ).subscribe();
  }
    public addChapter(curriculumId: string, request: AddChapterRequest): void {
    // يمكنك إضافة signals خاصة بالتحميل والخطأ لهذه العملية إذا أردت

    this.apiService.post<string>(`curriculums/${curriculumId}/chapters`, request).pipe(
      tap(() => {
        // عند النجاح، أفضل طريقة لضمان التحديث هي إعادة تحميل بيانات المنهج بالكامل
        // هذا يضمن أن الحالة في الواجهة الأمامية متطابقة 100% مع الواجهة الخلفية
        this.loadCurriculumById(curriculumId);
      }),
      catchError(err => {
        // يمكنك هنا التعامل مع الخطأ
        console.error('Failed to add chapter', err);
        return of(null);
      })
    ).subscribe();
  }
    public updateChapter(curriculumId: string, chapterId: string, request: UpdateChapterRequest): void {
    this.apiService.put<void>(`chapters/${chapterId}`, request).pipe(
      tap(() => {
        // عند النجاح، أعد تحميل بيانات المنهج لضمان تحديث الواجهة
        this.loadCurriculumById(curriculumId);
      }),
      catchError(err => {
        console.error('Failed to update chapter', err);
        return of(null);
      })
    ).subscribe();
  }

    // --- دالة حذف فصل ---
  public deleteChapter(curriculumId: string, chapterId: string): void {
    // API Endpoint: DELETE /api/chapters/{chapterId}
    this.apiService.delete<void>(`chapters/${chapterId}`).pipe(
      tap(() => {
        // عند النجاح، أعد تحميل بيانات المنهج لتحديث الواجهة
        this.loadCurriculumById(curriculumId);
      }),
      catchError(err => {
        console.error('Failed to delete chapter', err);
        return of(null);
      })
    ).subscribe();
  }

    // --- دالة إضافة درس جديد إلى فصل ---
  public addLesson(curriculumId: string, chapterId: string, request: AddLessonRequest): void {
    // API Endpoint: POST /api/Chapters/{chapterId}/lessons
    this.apiService.post<string>(`chapters/${chapterId}/lessons`, request).pipe(
      tap(() => {
        // كما فعلنا سابقًا، إعادة تحميل بيانات المنهج هي أضمن طريقة لتحديث الواجهة
        this.loadCurriculumById(curriculumId);
      }),
      catchError(err => {
        console.error('Failed to add lesson', err);
        return of(null);
      })
    ).subscribe();
  }
  // --- دالة حذف درس ---
  public deleteLesson(curriculumId: string, lessonId: string): void {
    // API Endpoint: DELETE /api/Lessons/{lessonId} [cite: 238]
    this.apiService.delete<void>(`lessons/${lessonId}`).pipe(
      tap(() => {
        // تحديث بيانات المنهج بعد الحذف لضمان تزامن الواجهة
        this.loadCurriculumById(curriculumId);
      }),
      catchError(err => {
        console.error('Failed to delete lesson', err);
        return of(null);
      })
    ).subscribe();
  }


   public clearActionError(): void {
    this.#state.update(s => ({ ...s, actionError: null }));
  }

  public publishLesson(curriculumId: string, lessonId: string): void {
    this.#state.update(s => ({ ...s, actionError: null })); // مسح الخطأ القديم
    this.apiService.put<void>(`lessons/${lessonId}/publish`, {}).pipe(
      // ...
      catchError((err) => {
        // تحديث الـ signal برسالة الخطأ القادمة من الـ API
        const detail = err.error?.detail || 'فشل نشر الدرس.';
        this.#state.update(s => ({...s, actionError: detail}));
        // لا تقم بإعادة تحميل البيانات عند حدوث خطأ
        return of(null);
      })
    ).subscribe();
  }
  // --- دالة إلغاء نشر درس ---
  public unpublishLesson(curriculumId: string, lessonId: string): void {
    this.apiService
      .put<void>(`lessons/${lessonId}/unpublish`, {}) // لا نحتاج لإرسال جسم للطلب
      .pipe(
        tap(() => this.loadCurriculumById(curriculumId)),
        catchError((err) => {
          console.error('Failed to unpublish lesson', err);
          return of(null);
        })
      )
      .subscribe();
  }
 // =======================================================
  // ## الدالة الجديدة لتعديل عنوان الدرس ##
  // =======================================================
  public updateLessonTitle(curriculumId: string, lessonId: string, request: UpdateLessonTitleRequest): void {
    // API Endpoint: PUT /api/Lessons/{lessonId}/title
    this.apiService.put<void>(`lessons/${lessonId}/title`, request).pipe(
      tap(() => {
        // أعد تحميل بيانات المنهج بالكامل لضمان تحديث الواجهة بالعنوان الجديد
        this.loadCurriculumById(curriculumId);
      }),
      catchError(err => {
        console.error('Failed to update lesson title', err);
        // يمكنك هنا التعامل مع الخطأ، مثلاً عن طريق إظهار رسالة للمستخدم
        return of(null);
      })
    ).subscribe();
  }
}
