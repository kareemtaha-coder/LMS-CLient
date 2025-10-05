import { Injectable, NgZone } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ComponentPreloaderService {
  constructor(
    private router: Router,
    private zone: NgZone,
    private auth: AuthService
  ) {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.preload().catch(() => {}), 0);
    });
  }

  private async preload() {
    const walk = async (routes: Routes) => {
      for (const route of routes) {
        if (route.loadComponent && route.data?.['preload']) {
          if (route.data['requiresAuth'] && !this.auth.isAuthenticated()) {
            continue;
          }
          try {
            await route.loadComponent();
          } catch {}
        }
        if (route.children) {
          await walk(route.children);
        }
      }
    };
    await walk(this.router.config);
  }
}
