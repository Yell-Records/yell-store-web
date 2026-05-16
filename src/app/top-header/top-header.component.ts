import { Component, inject } from '@angular/core';
import { Router, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { User } from '../users/user.model';
import { UserStore } from '../core/stores/user.store';
import { NotFoundComponent } from '../not-found/not-found.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { CartButtonComponent } from '../cart/cart-button/cart-button.component';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { AuthService } from '../auth/auth.service';
import { ConfirmDialogService } from '../shared/dialogs/confirm-dialog.service';
import { MessageService } from '../shared/message/message.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-top-header',
  imports: [
    RouterLinkWithHref,
    MatTabsModule,
    RouterLinkActive,
    MatButtonModule,
    CartButtonComponent,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatTooltip,
  ],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.scss',
})
export class TopHeaderComponent {
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);
  private readonly auth = inject(AuthService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly messageService = inject(MessageService);

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

  appLogout() {
    this.confirmDialog.confirm('Logout?').subscribe((confirmed) => {
      if (confirmed) {
        this.userStore.clear({ navigateLogin: true });
        this.messageService.info('You have been logged out.');
      }
    });
  }

  navigateAdminDash() {
    this.router.navigate(['/admin-dashboard']);
  }

  navigateUserSettings() {
    this.router.navigate(['/account-settings']);
  }

  private isAt404(): boolean {
    return this.router.routerState.snapshot.root.firstChild?.component === NotFoundComponent;
  }
}
