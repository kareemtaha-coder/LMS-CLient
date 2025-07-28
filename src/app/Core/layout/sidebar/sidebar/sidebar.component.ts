import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
export type IconName = 'edit' | 'book-open' | 'reports' | 'settings';
interface NavLink {
  path: string;
  label: string;
  iconName: IconName;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

  // Use a model signal for the collapsed state for two-way binding [cite: 2732]
  isCollapsed = model(false);


 private iconColors = ['bg-primary/80', 'bg-accent-green/80'];

  // الدوال المساعدة تبقى كما هي لأننا سنستخدمها مباشرة في القالب
  getInitials(label: string): string {
    const words = label.split(' ').filter(Boolean);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  getColorClass(index: number): string {
    return this.iconColors[index % this.iconColors.length];
  }

   navLinks = signal<NavLink[]>([
    {
      path: '/manage/curriculums',
      label: 'إدارة المناهج',
      iconName: 'edit'
    },
    {
      path: '/curriculums',
      label: 'عرض المناهج',
      iconName: 'book-open'
    },
  ]);
}
