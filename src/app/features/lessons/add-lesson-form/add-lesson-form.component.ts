import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-lesson-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex items-start gap-2">
      <input type="text" formControlName="title" placeholder="عنوان الدرس الجديد..." class="flex-grow block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      <button type="submit" [disabled]="form.invalid" class="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400">
        إضافة
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddLessonFormComponent {
  private fb = inject(FormBuilder);
  @Output() save = new EventEmitter<string>();

  form = this.fb.group({
    title: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.valid && this.form.value.title) {
      this.save.emit(this.form.value.title);
      this.form.reset();
    }
  }
}
