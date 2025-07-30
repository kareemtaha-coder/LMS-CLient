import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddImageRequest } from '../../../Core/api/api-models';

export interface ImageFormSaveRequest {
  title: string;
  caption: string;
  imageFile: File;
}

@Component({
  selector: 'app-add-image-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-fade-in">
      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
        <span class="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4Zm12 12H4l4-8 3 6 2-4 3 6Z" clip-rule="evenodd" />
            </svg>
        </span>
        {{ initialData ? 'تعديل الصورة' : 'إضافة صورة' }}
      </h3>

      <div class="relative">
        <input type="text" formControlName="title" id="imageTitle" class="block px-3 py-2.5 w-full text-sm rounded-lg border-2 border-slate-300 focus:border-green-600 peer" placeholder=" " />
        <label for="imageTitle" class="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-slate-800 px-2 right-1 peer-focus:px-2 peer-focus:text-green-600 dark:peer-focus:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">عنوان الصورة</label>
      </div>

      <div>
        <label for="imageFile" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ملف الصورة</label>
        <input type="file" (change)="onFileChange($event)" id="imageFile" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
        @if(imagePreview() && form.get('imageFile')?.valid){
          <div class="mt-4">
            <img [src]="imagePreview()" alt="Image Preview" class="max-h-40 rounded-lg"/>
          </div>
        }
      </div>

      <div class="relative">
        <textarea formControlName="caption" id="caption" rows="2" class="block px-3 py-2.5 w-full text-sm rounded-lg border-2 border-slate-300 focus:border-green-600 peer" placeholder=" "></textarea>
        <label for="caption" class="absolute text-sm text-slate-500 dark:text-slate-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-slate-800 px-2 right-1 peer-focus:px-2 peer-focus:text-green-600 dark:peer-focus:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">تعليق مصاحب (اختياري)</label>
      </div>

      <div class="flex justify-end gap-3 pt-3">
        <button type="button" (click)="cancel.emit()" class="px-5 py-2 font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">إلغاء</button>
        <button type="submit" [disabled]="form.invalid" class="px-6 py-2.5 font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:bg-slate-400">حفظ الصورة</button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddImageFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  imagePreview = signal<string | null>(null);

  @Input() initialData?: Omit<AddImageRequest, 'sortOrder' | 'imageFile'> & { imageUrl?: string };
  @Output() save = new EventEmitter<ImageFormSaveRequest>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.group({
    title: ['', Validators.required],
    caption: [''],
    // This line has been corrected
    imageFile: [null as File | null, Validators.required],
  });

  ngOnInit(): void {
    if (this.initialData) {
      this.form.get('imageFile')?.clearValidators();
      this.form.get('imageFile')?.updateValueAndValidity();
      this.form.patchValue(this.initialData);
      this.imagePreview.set(this.initialData.imageUrl || null);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.form.patchValue({ imageFile: file });
      this.form.get('imageFile')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue() as ImageFormSaveRequest);
    }
  }
}
