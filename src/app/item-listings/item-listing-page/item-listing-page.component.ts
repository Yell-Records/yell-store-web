import { Component, inject, OnInit, signal } from '@angular/core';
import { ItemListing } from '../item-listing.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemListingService } from '../item-listing.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../../auth/auth.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DecimalPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NotFoundComponent } from '../../not-found/not-found.component';
import { CartItemService } from '../../cart/cart-item.service';
import { MessageService } from '../../shared/message/message.service';
import { AddCartItemRequest } from '../../cart/add-cart-item-request.model';
import { yrTitle } from '../../title/qm-title';
import { DateUtil } from '../../shared/utils/date-util';
import { ShippingAlertComponent } from '../../shared/display/shipping-alert/shipping-alert.component';

@Component({
  imports: [
    MatGridListModule,
    NotFoundComponent,
    MatProgressSpinner,
    DecimalPipe,
    MatButtonModule,
    MatIcon,
    MatTooltip,
    ShippingAlertComponent,
  ],
  templateUrl: './item-listing-page.component.html',
  styleUrl: './item-listing-page.component.scss',
})
export class ItemListingPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly itemListingService = inject(ItemListingService);
  private readonly auth = inject(AuthService);
  private readonly title = inject(Title);
  private readonly cartService = inject(CartItemService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  private readonly _listing = signal<ItemListing | null>(null);

  readonly notFound = signal(false);

  ngOnInit(): void {
    this.listenForRouteParams();
  }

  get listing(): ItemListing | null {
    return this._listing();
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  navigateEdit() {
    this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }

  addToCart() {
    if (this.auth.isLoggedIn) return;

    const addItemRequest: AddCartItemRequest = {
      guestSessionId: this.auth.guestId!,
      listingInfo: this.listing!,
      itemQuantity: 1,
    };

    this.cartService.addItemToCart(addItemRequest).subscribe({
      next: () => this.messageService.info(`${this.listing?.title} was added to your cart.`),
      error: (err: HttpErrorResponse) => this.messageService.error(err.message),
    });
  }

  updatedHasDifference(): boolean {
    const listing = this._listing();
    if (!listing) return false;

    return DateUtil.isTimeDifferent(listing.createdAt, listing.updatedAt);
  }

  createdDate(): string {
    const listing = this._listing();
    if (!listing) return '';

    return DateUtil.formatDistanceToNow(listing.createdAt);
  }

  updatedDate(): string {
    const listing = this._listing();
    if (!listing) return '';

    return DateUtil.formatDistanceToNow(listing.updatedAt);
  }

  private loadListing(listingId: string) {
    this.itemListingService.getListingById(listingId).subscribe({
      next: (listing) => {
        this._listing.set(listing);
        this.title.setTitle(yrTitle(listing.title));
      },
      error: () => this.notFound.set(true),
    });
  }

  private listenForRouteParams() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('listid');

      if (id) {
        this.loadListing(id);
      }
    });
  }
}
