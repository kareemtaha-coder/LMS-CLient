import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImageWithCaptionContent, LessonContent } from '../../../../Core/api/api-models';
import { ToAbsoluteUrlPipe } from "../../../../Core/pipes/to-absolute-url.pipe";

@Component({
  selector: 'app-image-with-caption-content',
  standalone: true,
  imports: [ToAbsoluteUrlPipe],
  templateUrl: './image-with-caption-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageWithCaptionContentComponent {
  // 1. Input now accepts the general LessonContent union type.
  content = input.required<LessonContent>();

  // 2. We create a computed signal to safely cast the input to the specific type.
  imageContent = computed(() => {
    const c = this.content();
    return c.contentType === 'ImageWithCaption' ? (c as ImageWithCaptionContent) : null;
  });
}
