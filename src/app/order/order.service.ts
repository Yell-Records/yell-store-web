import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order } from './order.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateOrderRequest } from './create-order-request.model';
import { PayPalOrderResponse } from '../paypal/paypal-order-response.model';
import { UpdateOrderRequest } from './update-order-request.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  readonly baseUrl = `${environment.apiUrl}/orders`;

  private readonly http = inject(HttpClient);

  /**
   * Retrieves every order in a completed state.
   *
   * @returns
   */
  getCompletedOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl, {
      params: { unfinished: false },
    });
  }

  /**
   * Retrieves every order in a status of PAID or IN_PROGRESS.
   *
   * @returns
   */
  getInProgressOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl, {
      params: { unfinished: true },
    });
  }

  /**
   * Retrieves an order associated with an order number.
   *
   * ### Error code
   * - 404: If the order does not exist.
   *
   * @param orderNumber
   * @returns
   */
  getOrderFromNumber(orderNumber: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/order-number/${orderNumber}`);
  }

  /**
   * Marks an order as confirmed and in-progress. Requires admin.
   *
   * @param orderId
   * @returns
   */
  confirmOrder(orderId: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${orderId}/confirm`, {});
  }

  /**
   * Marks an order as shipped. Requires admin.
   *
   * @param orderId
   * @param trackingNumber UPS tracking number
   * @returns
   */
  shipOrder(orderId: string, trackingNumber: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${orderId}/shipped`, { trackingNumber });
  }

  /**
   * Marks an order as fulfilled (aka, package was delivered). Requires admin.
   *
   * @param orderId
   * @returns
   */
  fulfillOrder(orderId: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${orderId}/fulfill`, {});
  }

  /**
   * Marks an order as canceled. The order state must be pre-shipped. Requires admin.
   *
   * @param orderId
   * @returns
   */
  cancelOrder(orderId: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${orderId}/cancel`, {});
  }

  /**
   * Anonymizes customer info in an order. Only allowed if the order state is not in-progress.
   *
   * @param orderId
   * @returns Order with anonymized data
   */
  anonymizeOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${orderId}/anonymize`, {});
  }

  /**
   * Gets an order from its ID.
   *
   * @param orderId
   * @returns
   */
  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`);
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
   * Updates information on an order. Guest Session Id must match.
   *
   * @param orderId
   * @param updates
   * @returns
   */
  updateOrderDetails(orderId: string, updates: UpdateOrderRequest): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${orderId}`, updates);
  }

  /**
   * Creates a PayPal order for an existing order.
   *
   * @param orderId
   * @returns
   */
  createPayPalOrder(orderId: string): Observable<PayPalOrderResponse> {
    return this.http.post<PayPalOrderResponse>(`${this.baseUrl}/${orderId}/paypal/create`, {});
  }

  /**
   * Capture payment status after client confirms payment through PayPal.
   *
   * @param orderId ID of order to update.
   * @returns Order with new payment status
   */
  capturePayPalPayment(orderId: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/${orderId}/paypal/capture`, {});
  }
}
