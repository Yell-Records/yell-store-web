import { AfterViewInit, Component, inject, Input } from '@angular/core';
import { PayPalService } from '../paypal.service';
import { OrderService } from '../../order/order.service';
import { firstValueFrom } from 'rxjs';
import { Order } from '../../order/order.model';

@Component({
  selector: 'app-paypal-button',
  imports: [],
  template: `<div id="paypal-button-container"></div>`,
})
export class PayPalButtonComponent implements AfterViewInit {
  @Input({ required: true }) orderId!: string;

  private readonly paypal = inject(PayPalService);
  private readonly orderService = inject(OrderService);

  ngAfterViewInit(): void {
    this.paypal.loadSdk().then(() => {
      window.paypal
        .Buttons({
          createOrder: () => this.createPayPalOrder(),
          onApprove: () => this.capturePayPalOrder(),
        })
        .render('#paypal-button-container');
    });
  }

  private async createPayPalOrder(): Promise<string> {
    const res = await firstValueFrom(this.orderService.createPayPalOrder(this.orderId));

    return res.id;
  }

  private async capturePayPalOrder(): Promise<Order> {
    const updatedOrder = await firstValueFrom(this.orderService.capturePayPalPayment(this.orderId));

    return updatedOrder;
  }
}
