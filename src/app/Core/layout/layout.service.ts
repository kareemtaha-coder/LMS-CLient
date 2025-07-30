import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // ============================================
  // #1: State for the Main Application Sidebar
  // ============================================
  private _isAppSidebarCollapsed = signal<boolean>(false);

  /** Manages the visibility of the main sidebar of the entire application. */
  public readonly isAppSidebarCollapsed = computed(() => this._isAppSidebarCollapsed());

  public toggleAppSidebar(): void {
    this._isAppSidebarCollapsed.update(collapsed => !collapsed);
  }

  public hideAppSidebar(): void {
    this._isAppSidebarCollapsed.set(true);
  }

  public showAppSidebar(): void {
    this._isAppSidebarCollapsed.set(false);
  }


  // ============================================
  // #2: State for the Course-Specific Sidebar
  // ============================================
  private _isCourseSidebarCollapsed = signal<boolean>(false);

  /** Manages the visibility of the sidebar inside the course layout. */
  public readonly isCourseSidebarCollapsed = computed(() => this._isCourseSidebarCollapsed());

  public toggleCourseSidebar(): void {
    this._isCourseSidebarCollapsed.update(collapsed => !collapsed);
  }
}
