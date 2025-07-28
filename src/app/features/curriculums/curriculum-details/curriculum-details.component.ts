import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { CurriculumService } from '../curriculum.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common'; // Import NgClass for styling

@Component({
  selector: 'app-curriculum-details',
  imports: [RouterLink, NgClass], // Removed ChapterAccordionComponent, added NgClass
  templateUrl: './curriculum-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurriculumDetailsComponent {
  protected curriculumService = inject(CurriculumService);
  id = input.required<string>();

  // 1. Signal to track the selected chapter's ID
  selectedChapterId = signal<string | null>(null);

  // 2. Computed signal to get the full data of the selected chapter
  selectedChapter = computed(() => {
    const curriculum = this.curriculumService.selectedCurriculum();
    const chapterId = this.selectedChapterId();
    if (!curriculum || !chapterId) {
      return null;
    }
    return curriculum.chapters.find(c => c.id === chapterId) ?? null;
  });

  constructor() {
    effect(() => {
      // When the id from the URL changes, load the curriculum
      this.curriculumService.loadCurriculumById(this.id());
    });

    effect(() => {
      // When the curriculum data loads, automatically select the first chapter
      const curriculum = this.curriculumService.selectedCurriculum();
      if (curriculum?.chapters && curriculum.chapters.length > 0) {
        this.selectedChapterId.set(curriculum.chapters[0].id);
      }
    });
  }

  // Method to update the selected chapter ID when a user clicks
  selectChapter(id: string): void {
    this.selectedChapterId.set(id);
  }
}
