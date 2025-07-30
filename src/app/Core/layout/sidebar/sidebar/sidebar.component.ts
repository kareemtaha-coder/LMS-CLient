import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

// يبقى كما هو، فهو يحدد أنواع الأيقونات المسموح بها
export type IconName = 'edit' | 'book-open' | 'reports' | 'settings';

interface NavLink {
  path: string;
  label: string;
  iconName: IconName;
}
interface NavGroup {
  title: string;
  links: NavLink[];
}
@Component({
  selector: 'app-sidebar',
  standalone: true, // من الأفضل استخدام المكونات المستقلة (Standalone) في Angular الحديث
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // سنترك هذا فارغًا لأننا سنضع الكلاسات في HTML
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  // استخدام model signal ممتاز للـ two-way binding
  isCollapsed = model(false);

  // قائمة الروابط تبقى كما هي
  navGroups = signal<NavGroup[]>([
    {
      title: 'تصفح',
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
          iconName: 'edit'
        }
        // مستقبلاً، يمكنك إضافة روابط إدارة المستخدمين أو الإعدادات هنا
      ]
    }
  ]);
}
