import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurriculumSummary } from '../../../Core/api/api-models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-curriculum-card',
  imports: [RouterLink],
  templateUrl: './curriculum-card.component.html',
  styleUrls: ['./curriculum-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // For better performance
})
export class CurriculumCardComponent {
  // Use the new signal-based input to receive data
  curriculum = input.required<CurriculumSummary>();
}
