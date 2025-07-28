import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // A signal to control the visibility of the main sidebar
  isMainSidebarVisible = signal(true);

  hideMainSidebar() {
    this.isMainSidebarVisible.set(false);
  }

  showMainSidebar() {
    this.isMainSidebarVisible.set(true);
  }
}
