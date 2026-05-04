import { Component, inject } from '@angular/core';
import { CartItemService } from '../cart/cart-item.service';
import { AuthService } from '../auth/auth.service';
import { CartItemCardListComponent } from '../cart/cart-item-card-list/cart-item-card-list.component';
import { CurrencyPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAnchor } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CartItem } from '../cart/cart-item.model';
import { OrderService } from '../order/order.service';
import { CreateOrderRequest } from '../order/create-order-request.model';
import { MessageService } from '../shared/message/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [
    CartItemCardListComponent,
    CurrencyPipe,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAnchor,
    MatStepperModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartItemService);
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly checkoutForm = new FormGroup({
    buyerEmail: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    addressLine1: new FormControl('', Validators.required),
    addressLine2: new FormControl<string | null>(null),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  placeOrder() {
    if (this.checkoutForm.valid) {
      const req = this.extractFormValues();

      this.orderService.createOrder(req).subscribe({
        next: () => {
          this.messageService.success('Order placed!');
          this.router.navigate(['/home']);
        },
        error: () => this.messageService.error('Could not place order.'),
      });
    }
  }

  get cartItems(): CartItem[] {
    return this.cartService.cartItems();
  }

  get subtotal(): number {
    return this.cartService.subtotal();
  }

  get formPhone(): string {
    return this.checkoutForm.get('phone')!.value!;
  }

  shippingFullName(): string {
    const firstName = this.checkoutForm.get('firstName')!.value!;
    const lastName = this.checkoutForm.get('lastName')!.value!;

    return `${firstName} ${lastName}`;
  }

  shippingFullAddress(): string {
    const address1 = this.checkoutForm.get('addressLine1')!.value!;
    const address2 = this.checkoutForm.get('addressLine2')?.value;
    const city = this.checkoutForm.get('city')!.value!;
    const state = this.checkoutForm.get('state')!.value!;
    const zip = this.checkoutForm.get('postalCode')!.value;

    if (address2) {
      return `${address1}, ${address2}, ${city}, ${state} ${zip}`;
    } else {
      return `${address1}, ${city}, ${state} ${zip}`;
    }
  }

  private extractFormValues(): CreateOrderRequest {
    const req: CreateOrderRequest = {
      guestSessionId: this.auth.guestId!,
      buyerEmail: this.checkoutForm.get('buyerEmail')!.value!,
      shippingFirstName: this.checkoutForm.get('firstName')!.value!,
      shippingLastName: this.checkoutForm.get('lastName')!.value!,
      shippingAddressLine1: this.checkoutForm.get('addressLine1')!.value!,
      shippingAddressLine2: this.checkoutForm.get('addressLine2')?.value ?? null,
      shippingCity: this.checkoutForm.get('city')!.value!,
      shippingState: this.checkoutForm.get('state')!.value!,
      shippingPostalCode: this.checkoutForm.get('postalCode')!.value!,
      shippingPhone: this.checkoutForm.get('phone')!.value!,
      totalPaid: this.subtotal,
    };

    return req;
  }
}
