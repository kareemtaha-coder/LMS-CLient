import { Component, OnDestroy, OnInit, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../Core/layout/layout.service';
import { CurriculumService } from '../curriculums/curriculum.service';
import { NgClass } from '@angular/common'; // Import NgClass
import { ChapterAccordionComponent } from '../curriculums/chapter-accordion/chapter-accordion.component';

@Component({
  selector: 'app-course-layout',
  standalone: true,
  // Removed ChapterAccordionComponent, added RouterLink, RouterLinkActive, NgClass
  imports: [RouterOutlet, ChapterAccordionComponent],
  templateUrl: './course-layout.component.html',
  styleUrls: ['./course-layout.component.css'],
})
export class CourseLayoutComponent implements OnInit, OnDestroy {
  // ... The rest of the TypeScript code remains unchanged
  private layoutService = inject(LayoutService);
  protected curriculumService = inject(CurriculumService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();
  isSidebarCollapsed = signal(false);

  constructor() {
    effect(() => {
      this.curriculumService.loadCurriculumById(this.id());
    });

    effect(() => {
      const curriculum = this.curriculumService.selectedCurriculum();
      if (curriculum && !this.route.firstChild) {
        const firstChapter = curriculum.chapters?.[0];
        const firstLesson = firstChapter?.lessons?.[0];

        if (firstLesson) {
          this.router.navigate(['lessons', firstLesson.id], { relativeTo: this.route });
        }
      }
    });
  }

  ngOnInit(): void {
    this.layoutService.hideMainSidebar();
  }

  ngOnDestroy(): void {
    this.layoutService.showMainSidebar();
  }
   toggleSidebar(): void {
    this.isSidebarCollapsed.update(collapsed => !collapsed);
  }
}


// import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
// import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// import { NgClass } from '@angular/common';
// import { LayoutService } from '../../Core/layout/layout.service';
// import { CurriculumService } from '../curriculums/curriculum.service';
// import { ChapterAccordionComponent } from '../curriculums/chapter-accordion/chapter-accordion.component';
// import { LessonDetails, LessonContent } from '../../Core/api/api-models';

// @Component({
//   selector: 'app-course-layout',
//   standalone: true,
//   imports: [RouterOutlet, ChapterAccordionComponent, RouterLink, NgClass, RouterLinkActive],
//   templateUrl: './course-layout.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class CourseLayoutComponent implements OnInit, OnDestroy {
//   // --- Injected Services ---
//   private layoutService = inject(LayoutService);
//   protected curriculumService = inject(CurriculumService);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);

//   // --- Inputs from Router ---
//   id = input.required<string>();

//   // --- State Signals ---
//   // THE FIX: A new signal to control the sidebar's collapsed state.
//   isSidebarCollapsed = signal(false);

//   constructor() {
//     // This effect handles the initial navigation to the first lesson
//     effect(() => {
//       const curriculum = this.curriculumService.selectedCurriculum();
//       if (curriculum && !this.route.firstChild) {
//         const firstChapter = curriculum.chapters?.[0];
//         const firstLesson = firstChapter?.lessons?.[0];
//         if (firstLesson) {
//           this.router.navigate(['lessons', firstLesson.id], { relativeTo: this.route, replaceUrl: true });
//         }
//       }
//     });
//   }

//   ngOnInit(): void {
//     this.layoutService.hideMainSidebar();
//   }

//   ngOnDestroy(): void {
//     this.layoutService.showMainSidebar();
//   }

//   // --- Public Methods for the Template ---
//   // THE FIX: A method to toggle the sidebar state.
//   toggleSidebar(): void {
//     this.isSidebarCollapsed.update(collapsed => !collapsed);
//   }
// }
