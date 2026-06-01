import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { RouterLinkWithHref } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly router = inject(Router);

  readonly menuOpened = signal(false);

  constructor() {
    this.listenToRouterEvents();
  }

  private listenToRouterEvents() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.menuOpened.set(false));
  }

  toggleMenu() {
    this.menuOpened.set(!this.menuOpened());
  }

  closeMenu() {
    this.menuOpened.set(false);
  }
}
