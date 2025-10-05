import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LessonContent, RichTextContent } from '../../../../Core/api/api-models';
import { NgClass } from '@angular/common';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-rich-text-content',
  standalone: true,
  imports: [NgClass, SafeHtmlPipe],
  template: `
    @if (richTextContent(); as content) {
      <div class="flex flex-col items-center justify-center min-h-screen p-6 gap-10 rich-text-slide">
        <div
          dir="rtl"
          class="text-center leading-relaxed font-bold tracking-wide"
          [class]="getArabicTextSize(content.arabicText)"
          [ngClass]="highlightClasses()"
          style="font-family: 'Amiri Quran', 'Scheherazade New', 'Traditional Arabic', serif;"
          [innerHTML]="content.arabicText | safeHtml"
        ></div>

        <div
          lang="en"
          class="text-center leading-relaxed font-medium opacity-90"
          [class]="getEnglishTextSize(content.englishText)"
          [ngClass]="highlightClasses()"
          style="font-family: 'Playfair Display', Georgia, serif;"
          [innerHTML]="content.englishText | safeHtml"
        ></div>
      </div>
    }
  `,
  styleUrl: './rich-text-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full'
  }
})
export class RichTextContentComponent {
  content = input.required<LessonContent>();
  
  richTextContent = computed(() => {
    const c = this.content();
    if (c.contentType === 'RichText') {
      return c;
    }
    return null;
  });
  
  highlightClasses = computed(() => {
    const content = this.richTextContent();
    if (!content) return '';
    
    switch (content.noteType) {
      case 0:
        return 'text-blue-600 dark:text-blue-400';
      case 1:
        return 'text-amber-500 dark:text-amber-400';
      case 2:
        return 'text-teal-500 dark:text-teal-400';
      case 3:
      default:
        return 'text-slate-800 dark:text-slate-200';
    }
  });

  getArabicTextSize(text: string): string {
    const length = this.extractPlainText(text).length;
    if (length <= 20) return 'text-6xl md:text-8xl lg:text-9xl';
    if (length <= 50) return 'text-5xl md:text-7xl lg:text-8xl';
    if (length <= 100) return 'text-4xl md:text-6xl lg:text-7xl';
    if (length <= 200) return 'text-3xl md:text-5xl lg:text-6xl';
    return 'text-2xl md:text-4xl lg:text-5xl';
  }

  getEnglishTextSize(text: string): string {
    const length = this.extractPlainText(text).length;
    if (length <= 20) return 'text-4xl md:text-6xl lg:text-7xl';
    if (length <= 50) return 'text-3xl md:text-5xl lg:text-6xl';
    if (length <= 100) return 'text-2xl md:text-4xl lg:text-5xl';
    if (length <= 200) return 'text-xl md:text-3xl lg:text-4xl';
    return 'text-lg md:text-2xl lg:text-3xl';
  }

  private extractPlainText(html: string | null | undefined): string {
    if (!html) {
      return '';
    }
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
}
