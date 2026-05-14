import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../order/order.service';
import { AuthService } from '../../auth/auth.service';
import { Order } from '../../order/order.model';
import { OrdersListComponent } from '../../order/orders-list/orders-list.component';
import { finalize } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Paginator } from '../../shared/utils/paginator';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-orders-in-progress',
  imports: [OrdersListComponent, MatProgressSpinner, MatPaginator],
  templateUrl: './orders-in-progress.component.html',
  styleUrl: './orders-in-progress.component.scss',
})
export class OrdersInProgressComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orderPaginator = new Paginator<Order>(5);

  readonly loading = signal(true);

  ngOnInit(): void {
    this.orderService
      .getInProgressOrders()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (orders) => this.orderPaginator.setItems(orders),
      });
  }

  get unfinishedOrders(): Order[] {
    return this.orderPaginator.pagedItems();
  }
}
