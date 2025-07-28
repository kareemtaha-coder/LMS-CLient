import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LessonDetails, LessonContent } from '../../../Core/api/api-models';
import { from } from 'rxjs';

@Component({
  selector: 'app-lesson-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './lesson-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonLayoutComponent {
  // --- Injected Services ---
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // --- Inputs from Router Resolver ---
  // This is the single source of truth for this component's data.
  lesson = input.required<LessonDetails>();

  // --- State Signals ---
  private currentContentId = signal<string | undefined>(undefined);

  // --- Effects ---
  constructor() {
    // This effect handles the initial navigation to the first content piece.
    effect(() => {
      const lessonData = this.lesson();
      // Check if lesson data is available AND if there is no child route active yet.
      if (lessonData && !this.route.firstChild) {
        const firstContentId = lessonData.contents?.[0]?.id;
        if (firstContentId) {
          // Programmatically navigate to the first content page.
          this.router.navigate(['content', firstContentId], { relativeTo: this.route, replaceUrl: true });
        }
      }
    });
  }

  // --- Event Handlers ---
  onChildActivate(activatedComponent: object): void {
    const contentComponent = activatedComponent as { content: LessonContent };
    this.currentContentId.set(contentComponent.content?.id);
  }

  // --- Computed Signals for the Template ---
  protected navigation = computed(() => {
    const lessonData = this.lesson();
    const currentId = this.currentContentId();
    if (!lessonData || !currentId || lessonData.contents.length === 0) {
      return { prev: null, next: null, currentIndex: 0, total: 0 };
    }
    const currentIndex = lessonData.contents.findIndex((c: LessonContent) => c.id === currentId);
    const total = lessonData.contents.length;
    const prevId = currentIndex > 0 ? lessonData.contents[currentIndex - 1].id : null;
    const nextId = currentIndex < total - 1 ? lessonData.contents[currentIndex + 1].id : null;
    return { prev: prevId, next: nextId, currentIndex: currentIndex + 1, total };
  });

  // --- Public Methods for the Template ---
  protected navigate(contentId: string | null): void {
    if (contentId) {
      this.router.navigate(['../', contentId], { relativeTo: this.route.firstChild });
    }
  }
}
