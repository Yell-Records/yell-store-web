import { Component, inject, Input } from '@angular/core';
import { CartItemService } from '../cart-item.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-button',
  imports: [MatButtonModule],
  templateUrl: './cart-button.component.html',
  styleUrl: './cart-button.component.scss',
})
export class CartButtonComponent {
  private readonly cartService = inject(CartItemService);
  private readonly router = inject(Router);

  /** Use a bolder styling for the button. */
  @Input() guest = false;

  navigateCart() {
    this.router.navigate(['/cart']);
  }

  get cartItemCount(): number {
    return this.cartService.cartCount();
  }
}
