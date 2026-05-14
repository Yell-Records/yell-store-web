import { Component, Input } from '@angular/core';
import { Order } from '../order.model';
import { CurrencyPipe } from '@angular/common';
import { DateUtil } from '../../shared/utils/date-util';
import { RouterLink } from '@angular/router';

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

  fullNameOf(order: Order): string {
    return `${order.shippingFirstname} ${order.shippingLastname}`;
  }

  relevantTime(timestamp: string): string {
    return DateUtil.formatDistanceToNow(timestamp);
  }
}
