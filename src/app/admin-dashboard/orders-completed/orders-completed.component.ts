import { Component, inject, signal } from '@angular/core';
import { Paginator } from '../../shared/utils/paginator';
import { Order } from '../../order/order.model';
import { OrderService } from '../../order/order.service';
import { finalize } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OrdersListComponent } from '../../order/orders-list/orders-list.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-orders-completed',
  imports: [MatProgressSpinner, OrdersListComponent, MatPaginator],
  templateUrl: './orders-completed.component.html',
  styleUrl: './orders-completed.component.scss',
})
export class OrdersCompletedComponent {
  private readonly orderService = inject(OrderService);

  readonly orderPaginator = new Paginator<Order>(10);

  readonly loading = signal(true);

  ngOnInit(): void {
    this.orderService
      .getCompletedOrders()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (orders) => this.orderPaginator.setItems(orders),
      });
  }

  get finishedOrders(): Order[] {
    return this.orderPaginator.pagedItems();
  }
}
