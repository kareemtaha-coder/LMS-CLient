import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ExamplesGridContent, LessonContent } from '../../../../Core/api/api-models';
import { ToAbsoluteUrlPipe } from "../../../../Core/pipes/to-absolute-url.pipe";

@Component({
  selector: 'app-examples-grid-content',
  standalone: true,
  imports: [ToAbsoluteUrlPipe],
  templateUrl: './examples-grid-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplesGridContentComponent {
  // 1. Input now accepts the general LessonContent union type.
  content = input.required<LessonContent>();

  // 2. We create a computed signal to safely cast the input to the specific type.
  gridContent = computed(() => {
    const c = this.content();
    return c.contentType === 'ExamplesGrid' ? (c as ExamplesGridContent) : null;
  });
}
