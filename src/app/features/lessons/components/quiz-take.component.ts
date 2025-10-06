import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizContent, QuestionType, QuizQuestion, QuizAnswer } from '../../../Core/api/api-models';

export interface QuizSubmission {
  quizId: string;
  answers: { [questionId: string]: string | string[] };
  timeSpent: number;
  submittedAt: Date;
}

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-take.component.html',
  styleUrls: ['./quiz-take.component.css']
})
export class QuizTakeComponent {
  @Input() quiz!: QuizContent;
  @Output() quizSubmitted = new EventEmitter<QuizSubmission>();

  // Quiz state
  isQuizStarted = signal(false);
  isQuizSubmitted = signal(false);
  timeRemaining = signal(0);
  currentQuestionIndex = signal(0);
  
  // User answers
  userAnswers: { [questionId: string]: string | string[] } = {};
  
  // Timer
  private timerInterval: any;
  private startTime: Date = new Date();

  readonly QuestionType = QuestionType;

  get questionTypeLabels() {
    return {
      [QuestionType.MultipleChoice]: 'اختيار من متعدد',
      [QuestionType.TrueFalse]: 'صح أو خطأ',
      [QuestionType.FillInTheBlank]: 'ملء الفراغات',
      [QuestionType.ShortAnswer]: 'إجابة قصيرة',
      [QuestionType.Essay]: 'مقال'
    };
  }

  get currentQuestion(): QuizQuestion | null {
    const index = this.currentQuestionIndex();
    return this.quiz.questions[index] || null;
  }

  get totalQuestions(): number {
    return this.quiz.questions.length;
  }

  get progressPercentage(): number {
    return this.totalQuestions > 0 ? ((this.currentQuestionIndex() + 1) / this.totalQuestions) * 100 : 0;
  }

  get timeRemainingFormatted(): string {
    const minutes = Math.floor(this.timeRemaining() / 60);
    const seconds = this.timeRemaining() % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  startQuiz(): void {
    this.isQuizStarted.set(true);
    this.startTime = new Date();
    this.timeRemaining.set(this.quiz.timeLimitMinutes * 60);
    this.startTimer();
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      const remaining = this.timeRemaining() - 1;
      this.timeRemaining.set(remaining);
      
      if (remaining <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.totalQuestions - 1) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() - 1);
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.totalQuestions) {
      this.currentQuestionIndex.set(index);
    }
  }

  onAnswerChange(questionId: string, answer: string | string[]): void {
    this.userAnswers[questionId] = answer;
  }

  onTextInputChange(questionId: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.userAnswers[questionId] = target.value;
  }

  getAnswerForQuestion(questionId: string): string | string[] {
    return this.userAnswers[questionId] || '';
  }

  isQuestionAnswered(questionId: string): boolean {
    const answer = this.userAnswers[questionId];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return Boolean(answer && answer.toString().trim() !== '');
  }

  getAnsweredQuestionsCount(): number {
    return Object.keys(this.userAnswers).filter(questionId => 
      this.isQuestionAnswered(questionId)
    ).length;
  }

  submitQuiz(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const timeSpent = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
    
    const submission: QuizSubmission = {
      quizId: this.quiz.id,
      answers: this.userAnswers,
      timeSpent: timeSpent,
      submittedAt: new Date()
    };

    this.isQuizSubmitted.set(true);
    this.quizSubmitted.emit(submission);
  }

  calculateScore(): { correct: number; total: number; percentage: number } {
    let correct = 0;
    let total = 0;

    this.quiz.questions.forEach(question => {
      total += question.points;
      const userAnswer = this.userAnswers[question.id];
      
      if (this.isAnswerCorrect(question, userAnswer)) {
        correct += question.points;
      }
    });

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return { correct, total, percentage };
  }

  private isAnswerCorrect(question: QuizQuestion, userAnswer: string | string[]): boolean {
    if (!userAnswer) return false;

    const correctAnswers = question.answers.filter(answer => answer.isCorrect);
    
    switch (question.questionType) {
      case QuestionType.MultipleChoice:
        return correctAnswers.some(correct => correct.answerText === userAnswer);
      
      case QuestionType.TrueFalse:
        return correctAnswers.some(correct => correct.answerText === userAnswer);
      
      case QuestionType.FillInTheBlank:
      case QuestionType.ShortAnswer:
      case QuestionType.Essay:
        // For text-based answers, we'll do a simple string comparison
        // In a real application, you might want more sophisticated matching
        return correctAnswers.some(correct => 
          correct.answerText.toLowerCase().trim() === (userAnswer as string).toLowerCase().trim()
        );
      
      default:
        return false;
    }
  }

  isPassed(): boolean {
    const score = this.calculateScore();
    return score.percentage >= this.quiz.passingScore;
  }

  getQuestionTypeLabel(questionType: QuestionType): string {
    return this.questionTypeLabels[questionType] || 'غير محدد';
  }

  // Helper method for template
  get Math() {
    return Math;
  }

  // Helper method for template
  get timeSpent(): number {
    return Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
  }

  // Helper method for template
  goBack(): void {
    // Implementation depends on your routing setup
    // For now, we'll just log
    console.log('Go back to lesson');
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
