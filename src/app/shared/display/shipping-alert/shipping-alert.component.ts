import { Component, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

const alertKey = 'hideShippingAlert';

@Component({
  selector: 'app-shipping-alert',
  imports: [MatCard, MatIcon, MatTooltip, MatButtonModule],
  templateUrl: './shipping-alert.component.html',
  styleUrl: './shipping-alert.component.scss',
})
export class ShippingAlertComponent {
  readonly showAlert = signal(localStorage.getItem(alertKey) !== 'true');

  dismissAlert() {
    this.showAlert.set(false);
    localStorage.setItem(alertKey, 'true');
  }
}
