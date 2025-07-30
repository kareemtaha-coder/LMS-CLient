import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCurriculumRequest } from '../../../../Core/api/api-models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-curriculum-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './curriculum-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurriculumFormComponent {
  private fb = inject(FormBuilder);

  // Input لتحديد ما إذا كانت عملية الإرسال جارية
  isSubmitting = input<boolean>(false);

  // Output لإرسال بيانات النموذج عند الحفظ
  @Output() save = new EventEmitter<CreateCurriculumRequest>();

  // تعريف النموذج باستخدام Reactive Forms
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    introduction: ['', [Validators.required, Validators.minLength(10)]],
  });

  get title() { return this.form.get('title'); }
  get introduction() { return this.form.get('introduction'); }

   onSubmit(): void {
    // التحقق من صلاحية النموذج يضمن لنا أن القيم ليست فارغة أو null
    if (this.form.valid) {

      // نستخدم .value ونؤكد النوع باستخدام 'as CreateCurriculumRequest'
      // هذا يخبر TypeScript: "أنا متأكد أن قيمة النموذج هنا تطابق الواجهة المطلوبة"
      this.save.emit(this.form.value as CreateCurriculumRequest);

      this.form.reset();
    }
  }
}
