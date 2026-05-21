import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../cart-item.model';
import { CurrencyPipe } from '@angular/common';
import { ItemListing } from '../../item-listings/item-listing.model';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-item-card',
  imports: [CurrencyPipe, MatButtonModule, RouterLink],
  templateUrl: './cart-item-card.component.html',
  styleUrl: './cart-item-card.component.scss',
})
export class CartItemCardComponent {
  @Input({ required: true }) cartItem!: CartItem;
  @Input() showDelete = true;

  @Output() removeItem = new EventEmitter<ItemListing>();

  onRemove() {
    this.removeItem.emit(this.cartItem.itemListing);
  }
}
