import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprehensiveQuizComponent } from './comprehensive-quiz.component';
import { LessonService } from '../../lesson.service';
import { QuizContentResponse } from '../../../../Core/api/api-models';

@Component({
  selector: 'app-comprehensive-quiz-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ComprehensiveQuizComponent],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>تجربة الكويزات الشاملة</h1>
        <p>هذا مثال على كيفية استخدام الـ Comprehensive Quiz Component</p>
      </div>

      <div class="demo-controls">
        <button 
          class="btn btn-primary" 
          (click)="createNewQuiz()"
          [disabled]="isLoading()">
          إنشاء كويز جديد
        </button>
        
        <button 
          class="btn btn-secondary" 
          (click)="loadExistingQuiz()"
          [disabled]="isLoading()">
          تحميل كويز موجود
        </button>
      </div>

      <div class="demo-content">
        <app-comprehensive-quiz
          [lessonId]="lessonId"
          [quiz]="currentQuiz()"
          [isEditable]="true"
          (quizSaved)="onQuizSaved($event)"
          (quizDeleted)="onQuizDeleted($event)">
        </app-comprehensive-quiz>
      </div>

      <div class="demo-info" *ngIf="currentQuiz()">
        <h3>معلومات الكويز الحالي:</h3>
        <pre>{{ currentQuiz() | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .demo-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .demo-header h1 {
      color: #2d3748;
      margin-bottom: 8px;
    }

    .demo-header p {
      color: #718096;
    }

    .demo-controls {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 32px;
    }

    .demo-content {
      margin-bottom: 32px;
    }

    .demo-info {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
    }

    .demo-info h3 {
      color: #2d3748;
      margin-bottom: 12px;
    }

    .demo-info pre {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
      font-size: 0.8rem;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5a67d8;
    }

    .btn-secondary {
      background: #edf2f7;
      color: #4a5568;
      border: 1px solid #e2e8f0;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #e2e8f0;
    }
  `]
})
export class ComprehensiveQuizDemoComponent {
  private lessonService = inject(LessonService);

  // Demo data
  lessonId = 'demo-lesson-id';
  currentQuiz = signal<QuizContentResponse | null>(null);
  isLoading = signal(false);

  createNewQuiz() {
    this.currentQuiz.set(null);
  }

  loadExistingQuiz() {
    // مثال على كويز موجود
    const sampleQuiz: QuizContentResponse = {
      id: 'sample-quiz-id',
      title: 'اختبار تجريبي',
      passingScore: 70,
      allowRetake: true,
      maxAttempts: 3,
      questions: [
        {
          id: 'q1',
          questionText: 'ما هو لون السماء؟',
          questionType: 1, // MultipleChoice
          points: 1,
          answers: [
            {
              id: 'a1',
              answerText: 'أزرق',
              isCorrect: true
            },
            {
              id: 'a2',
              answerText: 'أحمر',
              isCorrect: false
            },
            {
              id: 'a3',
              answerText: 'أخضر',
              isCorrect: false
            }
          ]
        },
        {
          id: 'q2',
          questionText: 'هل الشمس أكبر من القمر؟',
          questionType: 2, // TrueFalse
          points: 1,
          answers: [
            {
              id: 'a4',
              answerText: 'صح',
              isCorrect: true
            },
            {
              id: 'a5',
              answerText: 'خطأ',
              isCorrect: false
            }
          ]
        }
      ]
    };

    this.currentQuiz.set(sampleQuiz);
  }

  onQuizSaved(quiz: QuizContentResponse) {
    console.log('Quiz saved:', quiz);
    this.currentQuiz.set(quiz);
  }

  onQuizDeleted(quizId: string) {
    console.log('Quiz deleted:', quizId);
    this.currentQuiz.set(null);
  }
}
