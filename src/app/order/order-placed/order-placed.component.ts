import { Component, inject, OnInit } from '@angular/core';
import { CheckoutNavigationService } from '../../checkout/checkout-navigation-service/checkout-navigation.service';

@Component({
  selector: 'app-order-placed',
  imports: [],
  templateUrl: './order-placed.component.html',
  styleUrl: './order-placed.component.scss',
})
export class OrderPlacedComponent implements OnInit {
  private readonly checkoutNavService = inject(CheckoutNavigationService);

  ngOnInit(): void {
    this.checkoutNavService.reset();
  }
}
