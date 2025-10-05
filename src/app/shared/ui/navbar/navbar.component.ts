import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private initialDark = localStorage.getItem('theme') === 'dark';
  private auth = inject(AuthService);

  readonly themeDark = signal(this.initialDark);
  readonly user = computed(() => this.auth.user());

  constructor() {
    effect(() => {
      if (this.themeDark()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', this.themeDark() ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.themeDark.update((value) => !value);
  }

  logout(): void {
    this.auth.logout();
  }
}
