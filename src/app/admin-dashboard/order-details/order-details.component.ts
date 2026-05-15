import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../order/order.service';
import { finalize } from 'rxjs';
import { Order } from '../../order/order.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OrderItemComponent } from '../../order-item/order-item.component';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  imports: [MatProgressSpinner, OrderItemComponent, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly loading = signal(true);
  readonly isError = signal(false);

  readonly _order = signal<Order | null>(null);

  ngOnInit(): void {
    this.listenForRouteParams();
  }

  get orderDetails(): Order | null {
    return this._order();
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
