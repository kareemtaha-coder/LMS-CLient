import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizContent, QuizQuestion, QuizAnswer } from '../../../Core/api/api-models';

@Component({
  selector: 'app-quiz-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-content.component.html',
  styleUrls: ['./quiz-content.component.css']
})
export class QuizContentComponent {
  @Input() quiz!: QuizContent;
  @Input() isEditable = false;
  @Output() editQuiz = new EventEmitter<QuizContent>();
  @Output() deleteQuiz = new EventEmitter<string>();

  getTotalQuestions(): number {
    return this.quiz?.questions?.length || 0;
  }

  onEdit() {
    this.editQuiz.emit(this.quiz);
  }

  onDelete() {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      this.deleteQuiz.emit(this.quiz.id);
    }
  }
}
