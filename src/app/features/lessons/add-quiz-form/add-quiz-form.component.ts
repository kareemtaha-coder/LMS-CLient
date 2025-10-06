import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LessonService } from '../lesson.service';
import { AddQuizRequest } from '../../../Core/api/api-models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-quiz-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-quiz-form.component.html',
  styleUrls: ['./add-quiz-form.component.css']
})
export class AddQuizFormComponent {
  @Input() lessonId!: string;
  @Input() sortOrder!: number;
  @Output() quizAdded = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private lessonService = inject(LessonService);

  quizForm: FormGroup;
  isSubmitting = false;

  constructor() {
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      passingScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      allowRetake: [true],
      maxAttempts: [3, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  onSubmit(): void {
    if (this.quizForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const request: AddQuizRequest = {
        sortOrder: this.sortOrder,
        title: this.quizForm.value.title,
        passingScore: this.quizForm.value.passingScore,
        allowRetake: this.quizForm.value.allowRetake,
        maxAttempts: this.quizForm.value.maxAttempts
      };

      this.lessonService.addQuizContent(this.lessonId, request).subscribe({
        next: (lesson) => {
          if (lesson) {
            this.quizAdded.emit();
            this.resetForm();
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error adding quiz:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.quizForm.reset({
      title: '',
      timeLimitMinutes: 30,
      passingScore: 70,
      allowRetake: true,
      maxAttempts: 3
    });
  }

  get title() { return this.quizForm.get('title'); }
  get passingScore() { return this.quizForm.get('passingScore'); }
  get maxAttempts() { return this.quizForm.get('maxAttempts'); }
}
