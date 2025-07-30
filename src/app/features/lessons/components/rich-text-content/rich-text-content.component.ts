import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LessonContent, RichTextContent } from '../../../../Core/api/api-models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-rich-text-content',
  standalone: true,
  imports: [NgClass],
  templateUrl: './rich-text-content.component.html',
  styleUrl: './rich-text-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // --- الإضافة الجديدة: اجعل المكون يملأ ارتفاع الحاوية الأبوية ---
  host: {
    class: 'block h-full'
  }
})
export class RichTextContentComponent {
  content = input.required<LessonContent>();

  richTextContent = computed(() => {
    const c = this.content();
    if (c.contentType === 'RichText') {
      return c as RichTextContent;
    }
    return null;
  });

  highlightClasses = computed(() => {
    const content = this.richTextContent();
    if (!content) return '';

    switch (content.noteType) {
      case 'Important':
        return 'text-blue-600 dark:text-blue-400';
      case 'Warning':
        return 'text-amber-500 dark:text-amber-400';
      case 'Tip':
        return 'text-teal-500 dark:text-teal-400';
      case 'Normal':
      default:
        return 'text-slate-800 dark:text-slate-200';
    }
  });
}
