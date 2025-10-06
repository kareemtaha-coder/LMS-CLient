import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LessonContent } from '../../../Core/api/api-models';

// Import all possible content components
import { RichTextContentComponent } from '../components/rich-text-content/rich-text-content.component';
import { VideoContentComponent } from '../components/video-content/video-content.component';
import { ImageWithCaptionContentComponent } from '../components/image-with-caption-content/image-with-caption-content.component';
import { ExamplesGridContentComponent } from '../components/examples-grid-content/examples-grid-content.component';
import { QuizContentComponent } from '../components/quiz-content.component';
import { QuizTakeComponent } from '../components/quiz-take.component';

@Component({
  selector: 'app-content-host',
  imports: [
    RichTextContentComponent,
    VideoContentComponent,
    ImageWithCaptionContentComponent,
    ExamplesGridContentComponent,
    QuizContentComponent,
    QuizTakeComponent
],
  templateUrl: './content-host.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full'
  }
})
export class ContentHostComponent {
  // This input will be populated by the router's resolver.
  content = input.required<LessonContent>();
  isEditable = input<boolean>(false);
}
