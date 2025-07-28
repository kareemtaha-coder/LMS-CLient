import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonService } from '../lesson.service';

// Import all the new content components
import { RichTextContentComponent } from '../components/rich-text-content/rich-text-content.component';
import { VideoContentComponent } from '../components/video-content/video-content.component';
import { ImageWithCaptionContentComponent } from '../components/image-with-caption-content/image-with-caption-content.component';
import { ExamplesGridContentComponent } from '../components/examples-grid-content/examples-grid-content.component';

@Component({
  selector: 'app-lesson-details',
  standalone: true,
  // Add all components to the imports array
  imports: [
    RouterLink,
    RichTextContentComponent,
    VideoContentComponent,
    ImageWithCaptionContentComponent,
    ExamplesGridContentComponent
  ],
  templateUrl: './lesson-details.component.html',
  styleUrl: './lesson-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonDetailsComponent {
  protected lessonService = inject(LessonService);
  id = input.required<string>();

  constructor() {
    effect(() => {
      this.lessonService.loadLessonById(this.id());
    });
  }
}
