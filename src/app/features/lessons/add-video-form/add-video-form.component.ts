import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// ADDED: Import the correct request type from the API models
import { AddVideoRequest } from '../../../Core/api/api-models';

// DELETED: The local interface that was causing the conflict has been removed.
// export interface AddVideoRequest { ... }

@Component({
  selector: 'app-add-video-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  // UPDATED: The template now includes a 'title' field
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-fade-in">
      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
        <span class="flex items-center justify-center h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm14.553 7.106A1 1 0 0 0 14 8v4a1 1 0 0 0 1.553.832l3-2a1 1 0 0 0 0-1.664l-3-2Z" />
            </svg>
        </span>
        {{ initialData ? 'تعديل الفيديو' : 'إضافة فيديو' }}
      </h3>

      <div class="relative">
        <input type="text" formControlName="title" id="videoTitle" class="block px-3 py-2.5 w-full text-sm text-slate-900 bg-transparent rounded-lg border-2 border-slate-300 focus:border-red-600 peer" placeholder=" " />
        <label for="videoTitle" class="floating-label-class...">عنوان الفيديو</label>
      </div>

      <div class="relative">
        <input type="text" formControlName="videoUrl" id="videoUrl" class="block px-3 py-2.5 w-full text-sm text-slate-900 bg-transparent rounded-lg border-2 border-slate-300 focus:border-red-600 peer" placeholder=" " />
        <label for="videoUrl" class="floating-label-class...">رابط الفيديو (YouTube, Vimeo)</label>
      </div>

      <div class="relative">
        <textarea formControlName="caption" id="caption" rows="2" class="block px-3 py-2.5 w-full text-sm text-slate-900 bg-transparent rounded-lg border-2 border-slate-300 focus:border-red-600 peer" placeholder=" "></textarea>
        <label for="caption" class="floating-label-class...">تعليق مصاحب (اختياري)</label>
      </div>

      <div class="flex justify-end gap-3 pt-3">
        <button type="button" (click)="cancel.emit()" class="px-5 py-2 font-semibold rounded-lg transition-colors text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">إلغاء</button>
        <button type="submit" [disabled]="form.invalid" class="px-6 py-2.5 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:bg-slate-400">حفظ الفيديو</button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVideoFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  // ADDED: The missing @Input for initialData to enable editing
  @Input() initialData?: Omit<AddVideoRequest, 'sortOrder'>;

  // UPDATED: The EventEmitter now correctly uses the imported type, omitting 'sortOrder'
  @Output() save = new EventEmitter<Omit<AddVideoRequest, 'sortOrder'>>();
  @Output() cancel = new EventEmitter<void>();

  // UPDATED: The form now includes the 'title' control
  form = this.fb.group({
    title: ['', Validators.required],
    videoUrl: ['', [Validators.required, Validators.pattern('^https?://.+$')]],
    caption: [''],
  });

  // ADDED: ngOnInit to patch the form with initial data when editing
  ngOnInit(): void {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as Omit<AddVideoRequest, 'sortOrder'>);
    }
  }
}
