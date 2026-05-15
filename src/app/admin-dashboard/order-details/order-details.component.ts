import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../order/order.service';
import { finalize } from 'rxjs';
import { Order } from '../../order/order.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OrderItemComponent } from '../../order-item/order-item.component';
import { CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderStatus } from '../../order/order-status.type';
import { MatAnchor } from '@angular/material/button';
import { MessageService } from '../../shared/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DateUtil } from '../../shared/utils/date-util';

@Component({
  selector: 'app-order-details',
  imports: [
    MatProgressSpinner,
    OrderItemComponent,
    CurrencyPipe,
    ReactiveFormsModule,
    MatAnchor,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);

  readonly loading = signal(true);
  readonly isError = signal(false);

  private readonly _order = signal<Order | null>(null);

  readonly OrderStatus = OrderStatus;

  readonly upsTrackingNumberControl = new FormControl('', [
    Validators.required,
    Validators.minLength(18),
  ]);

  ngOnInit(): void {
    this.listenForRouteParams();
  }

  get orderDetails(): Order | null {
    return this._order();
  }

  setInProgress() {
    this.orderService.confirmOrder(this._order()!.id).subscribe({
      next: () => {
        this.messageService.success('Order marked as in-progress.');
        this.updateOrderStatusSignal(OrderStatus.IN_PROGRESS);
      },
      error: (err: HttpErrorResponse) => this.messageService.error(err.message),
    });
  }

  submitShipping() {
    if (this.upsTrackingNumberControl.valid) {
      const shippingNumber = this.upsTrackingNumberControl.value!;

      this.orderService.shipOrder(this._order()!.id, shippingNumber).subscribe({
        next: () => {
          this.messageService.success('Order marked as shipped!');
          this.updateOrderStatusSignal(OrderStatus.SHIPPED);
        },
      });
    }
  }

  fullNameOf(order: Order): string {
    return `${order.shippingFirstname} ${order.shippingLastname}`;
  }

  fullAddressOf(order: Order): string {
    const address1 = order.shippingAddressLine1;
    const city = order.shippingCity;
    const state = order.shippingState;
    const zip = order.shippingPostalCode;

    if (order.shippingAddressLine2) {
      return `${address1} ${order.shippingAddressLine2}, ${city}, ${state} ${zip}`;
    } else {
      return `${address1}, ${city}, ${state} ${zip}`;
    }
  }

  creationDateRelevant(): string {
    const order = this._order();

    if (!order) return '';

    return DateUtil.formatDistanceToNow(order.createdAt);
  }

  shouldDisplayStaticShipping(): boolean {
    const order = this._order();

    if (!order) return false;

    const postShipStatuses: OrderStatus[] = [OrderStatus.FULFILLED, OrderStatus.SHIPPED];

    return postShipStatuses.includes(order.status);
  }

  private updateOrderStatusSignal(status: OrderStatus) {
    this._order.update((order) => (order ? { ...order, status: status } : order));
  }

  private loadOrder(orderId: string) {
    this.orderService
      .getOrder(orderId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (order) => this._order.set(order),
        error: () => this.isError.set(true),
      });
  }

  private listenForRouteParams() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const orderId = params.get('orderId');

      if (orderId) {
        this.loadOrder(orderId);
      }
    });
  }
}
