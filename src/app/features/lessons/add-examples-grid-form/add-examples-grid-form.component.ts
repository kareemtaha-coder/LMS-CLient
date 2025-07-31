import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddExamplesGridRequest } from '../../../Core/api/api-models';

@Component({
  selector: 'app-add-examples-grid-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-5 animate-fade-in">
      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
        <span class="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm0 11a2 2 0 0 0-2 2v-2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v2a2 2 0 0 0-2-2H5ZM11 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5Zm2 11a2 2 0 0 0-2 2v-2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v2a2 2 0 0 0-2-2h-2Z" /></svg>
        </span>
        إضافة شبكة أمثلة
      </h3>

      <div class="relative">
        <input type="text" formControlName="title" id="gridTitle" class="block px-3 py-2.5 w-full text-sm rounded-lg border-2 border-slate-300 focus:border-purple-600 peer" placeholder=" " />
        <label for="gridTitle" class="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-slate-800 px-2 right-1 peer-focus:px-2 peer-focus:text-purple-600 dark:peer-focus:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
          عنوان الشبكة (مثال: حروف الجر)
        </label>
      </div>

      <div class="flex justify-end gap-3 pt-3">
        <button type="button" (click)="cancel.emit()" class="px-5 py-2 font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
          إلغاء
        </button>
        <button type="submit" [disabled]="form.invalid" class="px-6 py-2.5 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:bg-slate-400">
          إنشاء الشبكة
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExamplesGridFormComponent {
 private fb = inject(FormBuilder);

  @Output() save = new EventEmitter<Omit<AddExamplesGridRequest, 'sortOrder'>>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.group({
    title: ['', Validators.required],
  });

  // This is the corrected method
  onSubmit(): void {
    // The form.valid check ensures that title is not null or empty.
    if (this.form.valid) {
      const formValue = this.form.getRawValue();

      // We explicitly check if title exists to satisfy TypeScript's strictness.
      if (formValue.title) {
        this.save.emit({ title: formValue.title });
      }
    }
  }
}
