import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, input, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-inline-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative w-full">
      @if (isEditing) {
        <input
          #inlineInput
          type="text"
          [formControl]="control"
          (blur)="cancel()"
          (keydown.enter)="save()"
          (keydown.escape)="cancel()"
          class="w-full px-2 py-1 bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-md focus:outline-none"
        />
      } @else {
        <div (click)="beginEdit()" class="w-full px-2 py-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700/50 cursor-pointer">
          {{ text() }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineEditComponent {
  // المدخلات والمخرجات
  text = input.required<string>();
  @Output() editSave = new EventEmitter<string>();

  // للتحكم في حقل الإدخال
  @ViewChild('inlineInput') private inputEl?: ElementRef<HTMLInputElement>;
  protected control = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  protected isEditing = false;

  beginEdit(): void {
    this.control.setValue(this.text());
    this.isEditing = true;
    // للتركيز على حقل الإدخال مباشرة بعد ظهوره
    setTimeout(() => this.inputEl?.nativeElement.focus(), 0);
  }

  save(): void {
    if (this.control.invalid || this.control.value === this.text()) {
      this.cancel();
      return;
    }
    this.editSave.emit(this.control.value);
    this.isEditing = false;
  }

  cancel(): void {
    this.isEditing = false;
  }
}
