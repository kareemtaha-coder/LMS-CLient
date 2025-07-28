import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
// Note the import of both the general and specific types
import { LessonContent, RichTextContent } from '../../../../Core/api/api-models';

@Component({
  selector: 'app-rich-text-content',
  standalone: true,
  imports: [],
  templateUrl: './rich-text-content.component.html',
  styleUrl: './rich-text-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextContentComponent {
  // 1. The input now accepts the general LessonContent union type.
  content = input.required<LessonContent>();

  // 2. We create a computed signal that safely casts the input to the specific type.
  // The template will use this signal, which is guaranteed to be the correct type.
  richTextContent = computed(() => {
    const c = this.content();
    // This check ensures type safety.
    if (c.contentType === 'RichText') {
      return c as RichTextContent;
    }
    return null; // Return null if the type is incorrect.
  });


   noteClasses = computed(() => {
    const content = this.richTextContent();
    if (!content) return {}; // Return empty object if content is null

    const noteType = content.noteType;
    const baseClasses = 'note flex gap-4 p-5 rounded-xl border-l-8';

    switch (noteType) {
      case 'Important':
        return `${baseClasses} bg-blue-50 border-blue-500 dark:bg-blue-950 dark:border-blue-700`;
      case 'Warning':
        return `${baseClasses} bg-amber-50 border-amber-500 dark:bg-amber-950 dark:border-amber-700`;
      case 'Tip':
        return `${baseClasses} bg-teal-50 border-teal-500 dark:bg-teal-950 dark:border-teal-700`;
      case 'Normal':
      default:
        return `${baseClasses} bg-slate-50 border-slate-400 dark:bg-slate-800 dark:border-slate-600`;
    }
  });
}
