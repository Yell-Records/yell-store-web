export interface CreateOrderRequest {
  guestSessionId: string;
  buyerEmail: string;
  totalPaid: number;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingPhone: string;
}
