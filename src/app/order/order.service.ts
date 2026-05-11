import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order } from './order.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateOrderRequest } from './create-order-request.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  readonly baseUrl = `${environment.apiUrl}/orders`;

  private readonly http = inject(HttpClient);

  /**
   * Gets every order.
   *
   * @param unfinished If orders should contain only unfulfilled statuses.
   * @returns
   */
  getOrders(unfinished: boolean): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl, {
      params: { unfinished },
    });
  }

  /**
   * Sends a request to create a new order in the database. If successful, the buyer's cart will be cleared.
   *
   * ### Error codes
   * - 400 (Bad Request) - If the buyer's cart is empty.
   * - 403 (Forbidden) - If the buyer placing the order cannot afford the total cost.
   *
   * @param order Information for the order.
   * @returns The order and its order items.
   */
  createOrder(orderInfo: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}`, orderInfo);
  }

  /**
   * Capture payment status after client confirms payment through PayPal.
   *
   * @param orderId ID of order to update.
   * @returns Order with new payment status
   */
  capturePayment(orderId: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/${orderId}/capture`, {});
  }
}
