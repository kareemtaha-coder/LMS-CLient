import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumService } from '../../curriculum.service';
import { CurriculumFormComponent } from '../../curriculum-form/curriculum-form/curriculum-form.component';
import { CreateCurriculumRequest } from '../../../../Core/api/api-models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-curriculums-page',
  standalone: true,
  imports: [CommonModule, CurriculumFormComponent, RouterLink],
  templateUrl: './manage-curriculums-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCurriculumsPageComponent {
  protected curriculumService = inject(CurriculumService);

  // هذه الدالة ستستقبل الحدث من المكون الابن (النموذج)
  handleCreateCurriculum(request: CreateCurriculumRequest): void {
    this.curriculumService.createCurriculum(request);
  }
}
