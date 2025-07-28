import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LessonContent, VideoContent } from '../../../../Core/api/api-models';
import { SafeUrlPipe } from '../../../../Core/pipes/safe-url.pipe';

@Component({
  selector: 'app-video-content',
  standalone: true,
  imports: [SafeUrlPipe], // <-- Add the pipe to the imports array
  templateUrl: './video-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
    class: 'block h-full'
  }
})
export class VideoContentComponent {
  content = input.required<LessonContent>();

  videoContent = computed(() => {
    const c = this.content();
    return c.contentType === 'Video' ? (c as VideoContent) : null;
  });
}
