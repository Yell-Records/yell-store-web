import { Order } from '../order/order.model';

interface PayPalButtonsConfig {
  createOrder: () => Promise<string>;
  onApprove: () => Promise<Order>;
}

interface PayPalNamespace {
  Buttons: (config: PayPalButtonsConfig) => {
    render: (selector: string) => void;
  };
}

declare global {
  interface Window {
    paypal: PayPalNamespace;
  }
}

export {};
