import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/ui/navbar/navbar.component';
import { SidebarComponent } from './Core/layout/sidebar/sidebar/sidebar.component';
import { LayoutService } from './Core/layout/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private router = inject(Router);
  protected layoutService = inject(LayoutService);

  readonly showShell = signal(!this.router.url.startsWith('/login'));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.showShell.set(!event.urlAfterRedirects.startsWith('/login'));
      });
  }
}
