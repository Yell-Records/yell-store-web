interface PayPalButtonsConfig {
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
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
