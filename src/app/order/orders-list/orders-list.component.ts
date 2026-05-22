import { Component, inject, Input } from '@angular/core';
import { Order } from '../order.model';
import { CurrencyPipe } from '@angular/common';
import { DateUtil } from '../../shared/utils/date-util';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-list',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
})
export class OrdersListComponent {
  @Input({ required: true }) orders!: Order[];

  /** Text to display for no entries. */
  @Input() emptyText = 'Nothing to show.';

  private readonly router = inject(Router);

  fullNameOf(order: Order): string {
    return `${order.shippingFirstname} ${order.shippingLastname}`;
  }

  normalizeStatus(status: string): string {
    return status.replaceAll('_', ' ');
  }

  relevantTime(timestamp: string): string {
    return DateUtil.formatDistanceToNow(timestamp);
  }

  navigateToOrder(order: Order) {
    this.router.navigate(['/admin-dashboard/orders/order-details', order.id]);
  }
}
