import { OrderItem } from '../order-item/order-item.model';
import { OrderStatus } from './order-status.type';

export interface Order {
  id: string;
  buyerEmail: string;
  status: OrderStatus;
  totalPaid: number;
  createdAt: string;
  shippingFirstname: string;
  shippingLastname: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingPhone: string;
  orderItems: OrderItem[];
  trackingNumber: string | null;
  trackingCarrier: string | null;
  paidAt: string | null;
  shippedAt: string | null;
}
