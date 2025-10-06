import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonService } from '../lesson.service';

// Import all the content components
import { RichTextContentComponent } from '../components/rich-text-content/rich-text-content.component';
import { VideoContentComponent } from '../components/video-content/video-content.component';
import { ImageWithCaptionContentComponent } from '../components/image-with-caption-content/image-with-caption-content.component';
import { ExamplesGridContentComponent } from '../components/examples-grid-content/examples-grid-content.component';
import { QuizTakeComponent } from '../components/quiz-take.component';
import { ComprehensiveQuizComponent } from '../components/comprehensive-quiz/comprehensive-quiz.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson-details',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    RichTextContentComponent,
    VideoContentComponent,
    ImageWithCaptionContentComponent,
    ExamplesGridContentComponent,
    QuizTakeComponent,
    ComprehensiveQuizComponent
  ],
  templateUrl: './lesson-details.component.html',
  styleUrl: './lesson-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonDetailsComponent {
  protected lessonService = inject(LessonService);
  id = input.required<string>();

  onQuizSaved(quiz: any) {
    // إعادة تحميل الدرس بعد حفظ الكويز
    this.lessonService.loadLesson(this.id()).subscribe();
  }

  onQuizDeleted(quizId: string) {
    // إعادة تحميل الدرس بعد حذف الكويز
    this.lessonService.loadLesson(this.id()).subscribe();
  }

  constructor() {
    effect(() => {
      this.lessonService.loadLessonById(this.id());
    });
  }
}
