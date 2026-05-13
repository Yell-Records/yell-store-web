export const OrderStatus = {
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  PAID: 'PAID',
  IN_PROGRESS: 'IN_PROGRESS',
  SHIPPED: 'SHIPPED',
  FULFILLED: 'FULFILLED',
  CANCELED: 'CANCELED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
