import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../order/order.service';
import { finalize } from 'rxjs';
import { Order } from '../../order/order.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OrderItemComponent } from '../../order-item/order-item.component';
import { CurrencyPipe, DatePipe, LowerCasePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderStatus } from '../../order/order-status.type';
import { MatAnchor } from '@angular/material/button';
import { MessageService } from '../../shared/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DateUtil } from '../../shared/utils/date-util';
import { MatIcon } from '@angular/material/icon';
import { ConfirmDialogService } from '../../shared/dialogs/confirm-dialog.service';
import { MatCheckbox } from '@angular/material/checkbox';

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
    LowerCasePipe,
    MatIcon,
    MatCheckbox,
    DatePipe,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly loading = signal(true);
  readonly isError = signal(false);

  private readonly _order = signal<Order | null>(null);

  readonly OrderStatus = OrderStatus;

  readonly upsTrackingNumberControl = new FormControl('', [
    Validators.required,
    Validators.minLength(18),
  ]);

  readonly orderItemCount = computed(() =>
    this._order()?.orderItems.reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly confirmCancelControl = new FormControl(false, Validators.requiredTrue);

  ngOnInit(): void {
    this.listenForRouteParams();
  }

  get orderDetails(): Order | null {
    return this._order();
  }

  setInProgress() {
    this.confirmDialog
      .confirm('Begin fulfillment of this order? This notifies the buyer.')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.orderService.confirmOrder(this._order()!.id).subscribe({
            next: () => {
              this.messageService.success('Order marked as in-progress.');
              this.updateOrderStatusSignal(OrderStatus.IN_PROGRESS);
            },
            error: (err: HttpErrorResponse) => this.messageService.error(err.message),
          });
        }
      });
  }

  canCancelOrder(): boolean {
    const validCancelStatuses: OrderStatus[] = [OrderStatus.PAID, OrderStatus.IN_PROGRESS];
    const status = this._order()?.status;

    if (!status) return false;

    return validCancelStatuses.includes(status);
  }

  submitShipping() {
    if (this.upsTrackingNumberControl.valid) {
      const message = 'Mark order as shipped? The buyer will be notified via email.';
      this.confirmDialog.confirm(message).subscribe((confirmed) => {
        if (confirmed) {
          const shippingNumber = this.upsTrackingNumberControl.value!;

          this.orderService.shipOrder(this._order()!.id, shippingNumber).subscribe({
            next: () => {
              this.messageService.success('Order marked as shipped!');
              this.updateOrderStatusSignal(OrderStatus.SHIPPED);
            },
          });
        }
      });
    }
  }

  markFulfilled() {
    const orderId = this._order()!.id;
    const message = 'Mark this order as fulfilled?';

    this.confirmDialog.confirm(message).subscribe((confirmed) => {
      if (confirmed) {
        this.orderService.fulfillOrder(orderId).subscribe({
          next: () => {
            this.messageService.success('Order marked as fulfilled.');
            this.updateOrderStatusSignal(OrderStatus.FULFILLED);
          },
          error: (err: HttpErrorResponse) => this.messageService.error(err.message),
        });
      }
    });
  }

  normalizedStatus(): string {
    const status = this._order()?.status;

    if (!status) return '';

    switch (status) {
      case OrderStatus.IN_PROGRESS:
        return 'IN PROGRESS';
      default:
        return status;
    }
  }

  showShippingForm(): boolean {
    return this._order()?.status === OrderStatus.IN_PROGRESS;
  }

  fullNameOf(order: Order): string {
    return `${order.shippingFirstname} ${order.shippingLastname}`;
  }

  addressPart2Of(order: Order): string {
    return `${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}`;
  }

  formattedPhone(): string {
    const order = this._order();

    if (!order) return '';

    const digits = order.shippingPhone;

    const area = digits.slice(0, 3);
    const prefix = digits.slice(3, 6);
    const line = digits.slice(6);

    return `(${area}) ${prefix}-${line}`;
  }

  creationDateRelevant(): string {
    const order = this._order();

    if (!order) return '';

    return DateUtil.formatDistanceToNow(order.createdAt);
  }

  showDangerZone(): boolean {
    return this.canCancelOrder() || this.canAnonymize();
  }

  canAnonymize(): boolean {
    const order = this._order();

    if (!order || order.anonymized) return false;

    const validStatuses: OrderStatus[] = [
      OrderStatus.CANCELED,
      OrderStatus.FULFILLED,
      OrderStatus.SHIPPED,
    ];

    return validStatuses.includes(order.status);
  }

  anonymizeOrder() {
    if (this.canAnonymize()) {
      const message =
        'Are you sure you want to anonymize the customer data on this order? This action is permanent.';

      this.confirmDialog
        .confirm(message, { title: 'WARNING', confirmBtn: 'Anonymize Data' })
        .subscribe((confirmed) => {
          if (confirmed) {
            const order = this._order();

            if (!order) {
              this.messageService.error('Order not loaded.');
              return;
            }

            // Call service to save anonymization
            this.orderService.anonymizeOrder(order.id).subscribe({
              next: (anonymizedOrder) => {
                this.messageService.success('Order anonymized successfully.');

                this._order.set(anonymizedOrder);
              },
              error: (err: HttpErrorResponse) => this.messageService.error(err.message),
            });
          }
        });
    }
  }

  paidAtDateRelevant(): string {
    const order = this._order();

    if (!order) return '';

    return DateUtil.formatDistanceToNow(order.paidAt!);
  }

  shouldDisplayStaticShipping(): boolean {
    const order = this._order();

    if (!order) return false;

    const postShipStatuses: OrderStatus[] = [OrderStatus.FULFILLED, OrderStatus.SHIPPED];

    return postShipStatuses.includes(order.status);
  }

  cancelOrder() {
    if (this.canCancelOrder()) {
      const message =
        'Are you sure you want to cancel this order? You will need to issue a refund.';

      this.confirmDialog
        .confirm(message, { title: 'WARNING', cancelBtn: 'Cancel Order', confirmBtn: 'Go Back' })
        .subscribe((confirmed) => {
          if (confirmed) {
            const orderId = this._order()!.id;

            this.orderService.cancelOrder(orderId).subscribe({
              next: () => {
                this.messageService.info('Order canceled.');
                this.updateOrderStatusSignal(OrderStatus.CANCELED);
              },
              error: (err: HttpErrorResponse) => this.messageService.error(err.message),
            });
          }
        });
    }
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
