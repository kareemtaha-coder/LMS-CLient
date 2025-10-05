import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImageWithCaptionContent, LessonContent } from '../../../../Core/api/api-models';
import { ToAbsoluteUrlPipe } from '../../../../Core/pipes/to-absolute-url.pipe';

@Component({
  selector: 'app-image-with-caption-content',
  standalone: true,
  imports: [ToAbsoluteUrlPipe],
  templateUrl: './image-with-caption-content.component.html',
  styleUrls: ['./image-with-caption-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full'
  }
})
export class ImageWithCaptionContentComponent {
  content = input.required<LessonContent>();

  imageContent = computed(() => {
    const c = this.content();
    return c.contentType === 'ImageWithCaption' ? (c as ImageWithCaptionContent) : null;
  });
}
