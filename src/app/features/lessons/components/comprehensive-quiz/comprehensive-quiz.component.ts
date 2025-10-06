import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CreateComprehensiveQuizRequest, 
  UpdateComprehensiveQuizRequest,
  QuizContentResponse,
  QuestionRequest,
  AnswerRequest,
  UpdateQuestionRequest,
  UpdateAnswerRequest
} from '../../../../Core/api/api-models';
import { LessonService } from '../../lesson.service';

@Component({
  selector: 'app-comprehensive-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comprehensive-quiz.component.html',
  styleUrls: ['./comprehensive-quiz.component.css']
})
export class ComprehensiveQuizComponent {
  @Input() lessonId!: string;
  @Input() quiz: QuizContentResponse | null = null;
  @Input() isEditable = false;
  @Output() quizSaved = new EventEmitter<QuizContentResponse>();
  @Output() quizDeleted = new EventEmitter<string>();

  private lessonService = inject(LessonService);

  // Component state
  isEditing = signal(false);
  isCreating = signal(false);
  isLoading = signal(false);

  // Form data - Simplified: Only title and questions
  quizForm = {
    title: '',
    questions: [] as QuestionForm[]
  };

  ngOnInit() {
    if (this.quiz) {
      this.loadQuizData();
    } else {
      this.isCreating.set(true);
      this.initializeNewQuiz();
    }
  }

  private loadQuizData() {
    this.quizForm = {
      title: this.quiz!.title,
      questions: this.quiz!.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        answers: q.answers.map(a => ({
          id: a.id,
          answerText: a.answerText,
          isCorrect: a.isCorrect
        }))
      }))
    };
  }

  private initializeNewQuiz() {
    this.quizForm = {
      title: '',
      questions: []
    };
  }

  // Question management
  addQuestion() {
    this.quizForm.questions.push({
      id: null,
      questionText: '',
      answers: []
    });
  }

  removeQuestion(index: number) {
    this.quizForm.questions.splice(index, 1);
  }

  // Answer management
  addAnswer(questionIndex: number) {
    this.quizForm.questions[questionIndex].answers.push({
      id: null,
      answerText: '',
      isCorrect: false
    });
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.quizForm.questions[questionIndex].answers.splice(answerIndex, 1);
  }

  // Form actions
  startEditing() {
    this.isEditing.set(true);
  }

  cancelEditing() {
    if (this.quiz) {
      this.loadQuizData();
    } else {
      this.initializeNewQuiz();
    }
    this.isEditing.set(false);
  }

  saveQuiz() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading.set(true);

    if (this.isCreating()) {
      this.createQuiz();
    } else {
      this.updateQuiz();
    }
  }

  private createQuiz() {
    const request: CreateComprehensiveQuizRequest = {
      sortOrder: 1, // سيتم تحديثه لاحقاً
      title: this.quizForm.title,
      questions: this.quizForm.questions.map(q => ({
        questionText: q.questionText,
        answers: q.answers.map(a => ({
          answerText: a.answerText,
          isCorrect: a.isCorrect
        }))
      }))
    };

    this.lessonService.createComprehensiveQuiz(this.lessonId, request).subscribe({
      next: (response) => {
        this.quiz = response;
        this.isCreating.set(false);
        this.isEditing.set(false);
        this.isLoading.set(false);
        this.quizSaved.emit(response);
      },
      error: (error) => {
        console.error('Error creating quiz:', error);
        this.isLoading.set(false);
        alert('فشل في إنشاء الاختبار: ' + error.message);
      }
    });
  }

  private updateQuiz() {
    const request: UpdateComprehensiveQuizRequest = {
      title: this.quizForm.title,
      questions: this.quizForm.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        answers: q.answers.map(a => ({
          id: a.id,
          answerText: a.answerText,
          isCorrect: a.isCorrect
        }))
      }))
    };

    this.lessonService.updateComprehensiveQuiz(this.quiz!.id, request).subscribe({
      next: (response) => {
        this.quiz = response;
        this.isEditing.set(false);
        this.isLoading.set(false);
        this.quizSaved.emit(response);
      },
      error: (error) => {
        console.error('Error updating quiz:', error);
        this.isLoading.set(false);
        alert('فشل في تحديث الاختبار: ' + error.message);
      }
    });
  }

  deleteQuiz() {
    if (!this.quiz || !confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      return;
    }

    this.isLoading.set(true);

    this.lessonService.deleteQuiz(this.quiz.id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.quizDeleted.emit(this.quiz!.id);
      },
      error: (error) => {
        console.error('Error deleting quiz:', error);
        this.isLoading.set(false);
        alert('فشل في حذف الاختبار: ' + error.message);
      }
    });
  }

  private validateForm(): boolean {
    if (!this.quizForm.title.trim()) {
      alert('يرجى إدخال عنوان الاختبار');
      return false;
    }

    if (this.quizForm.questions.length === 0) {
      alert('يرجى إضافة سؤال واحد على الأقل');
      return false;
    }

    for (let i = 0; i < this.quizForm.questions.length; i++) {
      const question = this.quizForm.questions[i];
      
      if (!question.questionText.trim()) {
        alert(`يرجى إدخال نص السؤال ${i + 1}`);
        return false;
      }

      if (question.answers.length < 2) {
        alert(`يرجى إضافة إجابتين على الأقل للسؤال ${i + 1}`);
        return false;
      }

      const hasCorrectAnswer = question.answers.some(a => a.isCorrect);
      if (!hasCorrectAnswer) {
        alert(`يرجى تحديد إجابة صحيحة واحدة على الأقل للسؤال ${i + 1}`);
        return false;
      }
    }

    return true;
  }

  getTotalQuestions(): number {
    return this.quizForm.questions.length;
  }
}

// Form interfaces - Simplified
interface QuestionForm {
  id: string | null;
  questionText: string;
  answers: AnswerForm[];
}

interface AnswerForm {
  id: string | null;
  answerText: string;
  isCorrect: boolean;
}
