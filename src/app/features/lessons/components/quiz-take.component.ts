import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizContent, QuizQuestion, QuizAnswer } from '../../../Core/api/api-models';
import { LessonService } from '../lesson.service';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-take.component.html',
  styleUrls: ['./quiz-take.component.css']
})
export class QuizTakeComponent {
  @Input() quiz!: QuizContent;
  private lessonService = inject(LessonService);

  // Component state
  isStarted = signal(false);
  isSubmitted = signal(false);
  currentQuestionIndex = signal(0);
  selectedAnswers = signal<Map<string, string>>(new Map());

  // Get current question
  get currentQuestion(): QuizQuestion | null {
    if (!this.quiz?.questions || this.currentQuestionIndex() >= this.quiz.questions.length) {
      return null;
    }
    return this.quiz.questions[this.currentQuestionIndex()];
  }

  // Start quiz
  startQuiz() {
    this.isStarted.set(true);
    this.currentQuestionIndex.set(0);
    this.selectedAnswers.set(new Map());
    this.isSubmitted.set(false);
  }

  // Select answer
  selectAnswer(questionId: string, answerId: string) {
    const answers = new Map(this.selectedAnswers());
    answers.set(questionId, answerId);
    this.selectedAnswers.set(answers);
  }

  // Navigate questions
  nextQuestion() {
    if (this.currentQuestionIndex() < this.quiz.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  // Submit quiz - Calculate results on frontend
  submitQuiz() {
    this.isSubmitted.set(true);
  }

  // Get score
  getScore() {
    let correct = 0;
    const total = this.quiz.questions.length;

    this.quiz.questions.forEach(question => {
      const selectedAnswerId = this.selectedAnswers().get(question.id);
      if (selectedAnswerId) {
        const correctAnswer = question.answers.find(a => a.isCorrect);
        if (correctAnswer && correctAnswer.id === selectedAnswerId) {
          correct++;
        }
      }
    });

    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0
    };
  }

  // Retake quiz
  retakeQuiz() {
    this.startQuiz();
  }

  // Check if answer is selected
  isAnswerSelected(questionId: string, answerId: string): boolean {
    return this.selectedAnswers().get(questionId) === answerId;
  }

  // Check if answer is correct (for results display)
  isAnswerCorrect(question: QuizQuestion, answerId: string): boolean {
    const answer = question.answers.find(a => a.id === answerId);
    return answer?.isCorrect || false;
  }
}

