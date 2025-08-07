import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

export type IconName = 'edit' | 'book-open' | 'reports' | 'settings';

interface NavLink {
  path: string;
  label: string;
  iconName: IconName;
  badge?: number;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  isCollapsed = model(false);

  navGroups = signal<NavGroup[]>([
    {
      title: 'التصفح والاستكشاف',
      links: [
        {
          path: '/curriculums',
          label: 'عرض المناهج',
          iconName: 'book-open'
        }
      ]
    },
    {
      title: 'إدارة المحتوى',
      links: [
        {
          path: '/manage/curriculums',
          label: 'إدارة المناهج',
          iconName: 'edit',
          badge: 3
        }
      ]
    }
  ]);
}
