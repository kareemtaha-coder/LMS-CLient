import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-chapter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex items-start gap-4 p-4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg">
      <div class="flex-grow">
        <input type="text" formControlName="title" placeholder="اكتب عنوان الفصل الجديد هنا..." class="block w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        @if (title?.invalid && title?.touched) {
          <p class="mt-1 text-xs text-red-500">العنوان مطلوب.</p>
        }
      </div>
      <button type="submit" [disabled]="form.invalid" class="px-6 py-2 h-full font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 transition-all">
        + إضافة فصل
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddChapterFormComponent {
  private fb = inject(FormBuilder);

  // يرسل عنوان الفصل الجديد فقط
  @Output() save = new EventEmitter<string>();

  form = this.fb.group({
    title: ['', Validators.required]
  });

  get title() { return this.form.get('title'); }

  onSubmit(): void {
    if (this.form.valid && this.title?.value) {
      this.save.emit(this.title.value);
      this.form.reset();
    }
  }
}
