import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddExampleItemRequest } from '../../../../Core/api/api-models';

@Component({
  selector: 'app-add-example-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 space-y-5 animate-fade-in">
      <h4 class="font-bold text-slate-800 dark:text-slate-200">إضافة مثال جديد</h4>

      <div>
        <label for="imageFile" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          ملف الصورة (مطلوب)
        </label>
        <input type="file" (change)="onFileChange($event, 'imageFile')" id="imageFile" required
               class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
        @if(imagePreview()){
          <img [src]="imagePreview()" alt="Image Preview" class="mt-3 max-h-32 rounded-lg shadow-sm"/>
        }
      </div>

      <div>
        <label for="audioFile" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          ملف الصوت (اختياري)
        </label>
        <input type="file" (change)="onFileChange($event, 'audioFile')" id="audioFile"
               class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button type="button" (click)="cancel.emit()" class="px-5 py-2 font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700">
          إلغاء
        </button>
        <button type="submit" [disabled]="form.invalid" class="px-6 py-2.5 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:bg-slate-400">
          حفظ المثال
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExampleItemFormComponent {
  private fb = inject(FormBuilder);

  @Output() save = new EventEmitter<AddExampleItemRequest>();
  @Output() cancel = new EventEmitter<void>();

  imagePreview = signal<string | null>(null);

  // 4. The form definition with a required imageFile
  form = this.fb.group({
    imageFile: [null as File | null, Validators.required],
    audioFile: [null as File | null],
  });

  // 5. This function updates the form when a file is selected
  onFileChange(event: Event, controlName: 'imageFile' | 'audioFile'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.form.patchValue({ [controlName]: file });
      this.form.get(controlName)?.updateValueAndValidity(); // This is crucial for the button to enable

      if (controlName === 'imageFile') {
        const reader = new FileReader();
        reader.onload = () => this.imagePreview.set(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  }

  // 6. This function is called on submit
  onSubmit(): void {
    if (this.form.valid && this.form.value.imageFile) {
      this.save.emit(this.form.getRawValue() as AddExampleItemRequest);
    }
  }
}
