import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddExamplesGridRequest } from '../../../Core/api/api-models';

@Component({
  selector: 'app-add-examples-grid-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
        <span class="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm0 11a2 2 0 0 0-2 2v-2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v2a2 2 0 0 0-2-2H5ZM11 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5Zm2 11a2 2 0 0 0-2 2v-2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v2a2 2 0 0 0-2-2h-2Z" /></svg>
        </span>
        {{ initialData ? 'تعديل شبكة الأمثلة' : 'إضافة شبكة أمثلة' }}
      </h3>
      <div class="relative">
        <input type="text" formControlName="title" id="gridTitle" class="form-input" placeholder=" " />
        <label for="gridTitle" class="floating-label">عنوان الشبكة</label>
      </div>
      <div formArrayName="examples">
        @for(example of examples.controls; track $index) {
          <div [formGroupName]="$index" class="p-3 my-2 border rounded-lg dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3 relative">
            <button (click)="removeExample($index)" type="button" class="absolute -top-2 -left-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center">&times;</button>
            <textarea formControlName="arabic" placeholder="المثال بالعربية..." rows="2" class="form-textarea"></textarea>
            <textarea formControlName="english" placeholder="Example in English..." rows="2" class="form-textarea"></textarea>
          </div>
        }
      </div>
      <div class="flex justify-between items-center pt-2">
        <button (click)="addExample()" type="button" class="px-4 py-2 text-sm font-semibold text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200">إضافة مثال جديد</button>
        <div class="flex gap-3">
          <button type="button" (click)="cancel.emit()" class="form-cancel-button">إلغاء</button>
          <button type="submit" [disabled]="form.invalid" class="form-save-button bg-purple-600 hover:bg-purple-700">حفظ الشبكة</button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExamplesGridFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() initialData?: Omit<AddExamplesGridRequest, 'sortOrder'>;
  @Output() save = new EventEmitter<Omit<AddExamplesGridRequest, 'sortOrder'>>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.group({
  title: ['', Validators.required],
  examples: this.fb.array<FormGroup>([], Validators.minLength(1))
});

  get examples(): FormArray {
    return this.form.get('examples') as FormArray;
  }
  ngOnInit(): void {
    if (this.initialData) {
      // EDIT MODE: Populate the form with existing data.

      // 1. Clear any default empty rows from the 'examples' FormArray.
      // this.examples.clear();

      // // 2. If examples exist in the initial data, create a form group for each one.
      // if (this.initialData.examples && this.initialData.examples.length > 0) {
      //   this.initialData.examples.forEach(ex => this.addExample(ex.arabic, ex.english));
      // }

      // 3. Patch the main form control (like the 'title').
      this.form.patchValue(this.initialData);

    } else {
      // ADD MODE: Start the form with one empty example row.
      this.addExample();
    }
  }

  createExampleGroup(arabic = '', english = ''): FormGroup {
    return this.fb.group({
      arabic: [arabic, Validators.required],
      english: [english, Validators.required]
    });
  }

  addExample(arabic = '', english = ''): void {
    this.examples.push(this.createExampleGroup(arabic, english));
  }

  removeExample(index: number): void {
    this.examples.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as Omit<AddExamplesGridRequest, 'sortOrder'>);
    }
  }
}
