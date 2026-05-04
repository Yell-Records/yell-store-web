import { Component, inject, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ItemListing } from '../item-listing.model';
import { MatFabButton } from '@angular/material/button';
import { CartItemService } from '../../cart/cart-item.service';
import { AuthService } from '../../auth/auth.service';
import { MessageService } from '../../shared/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ShortNumberPipe } from 'src/app/shared/pipes/short-number.pipe';
import { AddCartItemRequest } from 'src/app/cart/add-cart-item-request.model';

@Component({
  selector: 'app-item-listing',
  imports: [MatCardModule, CurrencyPipe, MatIcon, MatTooltip, MatFabButton, ShortNumberPipe],
  templateUrl: './item-listing.component.html',
  styleUrl: './item-listing.component.scss',
})
export class ItemListingComponent {
  @Input({ required: true }) listing!: ItemListing;
  @Input() showUsername = true;

  private readonly cartService = inject(CartItemService);
  private readonly auth = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  navigateToItem() {
    this.router.navigate([`/listing/${this.listing.id}`]);
  }

  addToCart(): void {
    const addItemRequest: AddCartItemRequest = {
      guestSessionId: this.auth.guestId!,
      listingInfo: this.listing,
      itemQuantity: 1,
    };

    this.cartService.addItemToCart(addItemRequest).subscribe({
      next: (item) => this.messageService.info(`${item.itemListing.title} was added to your cart.`),
      error: (err: HttpErrorResponse) =>
        this.messageService.error(`Couldn't add item: ${err.message}`),
    });
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }
}
