import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  // Use a signal to control the collapsed state. This is our single source of truth.
  sidebarCollapsed = signal<boolean>(false);
  protected layoutService = inject(LayoutService); // Inject the service
  // This method will be called by child components (e.g., the navbar) to toggle the state.
  toggleSidebar(): void {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }
}
