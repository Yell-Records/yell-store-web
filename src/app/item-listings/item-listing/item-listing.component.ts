import { Component, inject, Input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ItemListing } from '../item-listing.model';
import { MatFabButton } from '@angular/material/button';
import { CartItemService } from '../../cart/cart-item.service';
import { MessageService } from '../../shared/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AddCartItemRequest } from '../../cart/add-cart-item-request.model';
import { UserStore } from '../../core/stores/user.store';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-item-listing',
  imports: [MatCardModule, CurrencyPipe, MatIcon, MatTooltip, MatFabButton],
  templateUrl: './item-listing.component.html',
  styleUrl: './item-listing.component.scss',
})
export class ItemListingComponent {
  @Input({ required: true }) listing!: ItemListing;
  @Input() showUsername = true;

  private readonly cartService = inject(CartItemService);
  private readonly userStore = inject(UserStore);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  readonly isAdding = signal(false);

  navigateToItem() {
    this.router.navigate([`/listing/${this.listing.id}`]);
  }

  addToCart(): void {
    const addItemRequest: AddCartItemRequest = {
      guestSessionId: this.userStore.guestSessionId!, // Not null since users cannot add items
      listingInfo: this.listing,
      itemQuantity: 1,
    };

    this.isAdding.set(true);

    this.cartService
      .addItemToCart(addItemRequest)
      .pipe(finalize(() => this.isAdding.set(false)))
      .subscribe({
        next: (item) =>
          this.messageService.info(`${item.itemListing.title} was added to your cart.`),
        error: (err: HttpErrorResponse) =>
          this.messageService.error(`Couldn't add item: ${err.message}`),
      });
  }

  get isLoggedIn(): boolean {
    return this.userStore.hasUser();
  }
}
