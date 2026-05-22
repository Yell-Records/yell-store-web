import { Component, inject, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DigitsOnlyDirective } from '../../directives/digits-only.directive';
import { MatAnchor } from '@angular/material/button';
import { OrderService } from '../../../order/order.service';
import { Router } from '@angular/router';
import { MessageService } from '../../message/message.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-number-search',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, DigitsOnlyDirective, MatAnchor],
  templateUrl: './order-number-search.component.html',
  styleUrl: './order-number-search.component.scss',
})
export class OrderNumberSearchComponent {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  /** Text to display in the input box. */
  @Input() placeholder = 'Order #';

  readonly searchControl = new FormControl('');
  readonly reqSent = signal(false);

  searchAndNavigate() {
    const raw = this.searchControl.value?.trim() ?? '';
    if (raw === '') {
      return;
    }

    const num = Number(raw);

    if (!isNaN(num)) {
      this.reqSent.set(true);

      this.routeToOrder(num);
    }
  }

  reset() {
    this.searchControl.reset();
  }

  private routeToOrder(orderNumber: number) {
    const detailsUrl = '/admin-dashboard/orders/order-details';

    this.orderService
      .getOrderFromNumber(orderNumber)
      .pipe(finalize(() => this.reqSent.set(false)))
      .subscribe({
        next: (order) => this.router.navigate([detailsUrl, order.id]),
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.messageService.error('Order not found.');
          } else {
            this.messageService.error(err.message);
          }
        },
      });
  }
}
