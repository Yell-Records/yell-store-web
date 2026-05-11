import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayPalService {
  private sdkLoaded = false;

  loadSdk(): Promise<void> {
    if (this.sdkLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=USD`;
      script.onload = () => {
        this.sdkLoaded = true;
        resolve();
      };

      script.onerror = () => reject('Failed to load PayPal SDK');

      document.body.appendChild(script);
    });
  }
}
