import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizContent, QuestionType, QuizQuestion, QuizAnswer } from '../../../Core/api/api-models';
import { LessonService } from '../lesson.service';
import { AddQuestionRequest, AddAnswerRequest } from '../../../Core/api/api-models';

@Component({
  selector: 'app-quiz-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-content.component.html',
  styleUrls: ['./quiz-content.component.css']
})
export class QuizContentComponent {
  @Input() quiz!: QuizContent;
  @Input() isEditable = false;
  @Output() editQuiz = new EventEmitter<QuizContent>();
  @Output() deleteQuiz = new EventEmitter<string>();

  private lessonService = inject(LessonService);

  // Question management
  showAddQuestionForm = false;
  newQuestion: Partial<AddQuestionRequest> = {
    questionText: '',
    questionType: QuestionType.MultipleChoice,
    points: 1
  };

  // Answer management
  showAddAnswerForm: { [questionId: string]: boolean } = {};
  newAnswers: { [questionId: string]: Partial<AddAnswerRequest> } = {};

  // Quiz settings
  showSettingsForm = false;
  quizSettings = {
    passingScore: 70,
    allowRetake: true,
    maxAttempts: 3
  };

  readonly QuestionType = QuestionType;

  get questionTypeLabels() {
    return {
      [QuestionType.MultipleChoice]: 'اختيار من متعدد',
      [QuestionType.TrueFalse]: 'صح أو خطأ',
      [QuestionType.FillInTheBlank]: 'ملء الفراغ',
      [QuestionType.ShortAnswer]: 'إجابة قصيرة',
      [QuestionType.Essay]: 'مقال'
    };
  }

  ngOnInit() {
    this.initializeQuizSettings();
  }

  private initializeQuizSettings() {
    this.quizSettings = {
      passingScore: this.quiz.passingScore,
      allowRetake: this.quiz.allowRetake,
      maxAttempts: this.quiz.maxAttempts
    };
  }

  // Question Management
  toggleAddQuestionForm() {
    this.showAddQuestionForm = !this.showAddQuestionForm;
    if (this.showAddQuestionForm) {
      this.newQuestion = {
        questionText: '',
        questionType: QuestionType.MultipleChoice,
        points: 1
      };
    }
  }

  addQuestion() {
    if (!this.newQuestion.questionText?.trim()) return;

    const request: AddQuestionRequest = {
      questionText: this.newQuestion.questionText!,
      questionType: this.newQuestion.questionType!,
      points: this.newQuestion.points || 1
    };

    this.lessonService.addQuestionToQuiz(this.quiz.id, request).subscribe({
      next: () => {
        this.showAddQuestionForm = false;
        this.newQuestion = {};
      },
      error: (error) => {
        console.error('Error adding question:', error);
      }
    });
  }

  // Answer Management
  toggleAddAnswerForm(questionId: string) {
    this.showAddAnswerForm[questionId] = !this.showAddAnswerForm[questionId];
    if (this.showAddAnswerForm[questionId]) {
      this.newAnswers[questionId] = {
        quizContentId: this.quiz.id,
        answerText: '',
        isCorrect: false
      };
    }
  }

  addAnswer(questionId: string) {
    const answerData = this.newAnswers[questionId];
    if (!answerData?.answerText?.trim()) return;

    const request: AddAnswerRequest = {
      quizContentId: this.quiz.id,
      answerText: answerData.answerText,
      isCorrect: answerData.isCorrect || false
    };

    this.lessonService.addAnswerToQuestion(questionId, request).subscribe({
      next: () => {
        this.showAddAnswerForm[questionId] = false;
        delete this.newAnswers[questionId];
      },
      error: (error) => {
        console.error('Error adding answer:', error);
      }
    });
  }

  // Quiz Settings
  toggleSettingsForm() {
    this.showSettingsForm = !this.showSettingsForm;
    if (this.showSettingsForm) {
      this.initializeQuizSettings();
    }
  }

  updateQuizSettings() {
    this.lessonService.updateQuizSettings(this.quiz.id, this.quizSettings).subscribe({
      next: () => {
        this.showSettingsForm = false;
      },
      error: (error) => {
        console.error('Error updating quiz settings:', error);
      }
    });
  }

  // Utility methods
  getQuestionTypeLabel(questionType: QuestionType): string {
    return this.questionTypeLabels[questionType] || 'غير محدد';
  }

  getTotalPoints(): number {
    return this.quiz.questions.reduce((total, question) => total + question.points, 0);
  }

  getCorrectAnswersCount(question: QuizQuestion): number {
    return question.answers.filter(answer => answer.isCorrect).length;
  }

  onEditQuiz() {
    this.editQuiz.emit(this.quiz);
  }

  onDeleteQuiz() {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      this.deleteQuiz.emit(this.quiz.id);
    }
  }
}
