import { Component, inject } from '@angular/core';
import { Router, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { User } from '../users/user.model';
import { UserStore } from '../core/stores/user.store';
import { NotFoundComponent } from '../not-found/not-found.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { CartButtonComponent } from '../cart/cart-button/cart-button.component';

@Component({
  selector: 'app-top-header',
  imports: [
    RouterLinkWithHref,
    MatTabsModule,
    RouterLinkActive,
    MatButtonModule,
    CartButtonComponent,
  ],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.scss',
})
export class TopHeaderComponent {
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);

  get user(): User | null {
    return this.userStore.user();
  }

  showNavTabs(): boolean {
    const isAtCheckout = this.router.url.includes('/checkout');

    return !isAtCheckout && !this.isAt404();
  }

  showViewCart(): boolean {
    const isAtCheckout = this.router.url.includes('/checkout');
    const isAtCart = this.router.url.includes('/cart');

    return !isAtCheckout && !isAtCart;
  }

  private isAt404(): boolean {
    return this.router.routerState.snapshot.root.firstChild?.component === NotFoundComponent;
  }
}
