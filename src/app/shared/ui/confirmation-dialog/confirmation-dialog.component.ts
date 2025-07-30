import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{{ title() }}</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">{{ message() }}</p>

        <div class="flex justify-end gap-4">
          <button (click)="cancel.emit()" class="px-5 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            إلغاء
          </button>
          <button (click)="confirm.emit()" class="px-5 py-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition-colors">
            تأكيد الحذف
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  // مدخلات لتخصيص رسالة النافذة
  title = input.required<string>();
  message = input.required<string>();

  // مخرجات لإعلام المكون الأب بقرار المستخدم
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
