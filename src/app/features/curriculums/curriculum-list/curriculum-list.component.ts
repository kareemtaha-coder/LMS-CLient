import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurriculumService } from '../curriculum.service';
import { CommonModule } from '@angular/common';
import { CurriculumCardComponent } from '../curriculum-card/curriculum-card.component';

@Component({
  selector: 'app-curriculum-list',
  imports: [CommonModule,CurriculumCardComponent], // We will add the dumb component here later
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['./curriculum-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurriculumListComponent {
  // Inject the service to get access to the state signals
  protected curriculumService = inject(CurriculumService);
}
