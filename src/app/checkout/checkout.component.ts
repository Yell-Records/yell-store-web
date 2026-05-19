import { Component, HostListener, inject, signal } from '@angular/core';
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
import { PersonNameDirective } from '../shared/directives/person-name.directive';
import { MatInput } from '@angular/material/input';
import { AddressDirective } from '../shared/directives/address.directive';
import { CityDirective } from '../shared/directives/city.directive';
import { US_STATES } from '../shared/data/us-states';
import { ZipCodeDirective } from '../shared/directives/zip-code.directive';
import { EmailDirective } from '../shared/directives/email.directive';
import { PhoneInputComponent } from '../shared/inputs/phone-input/phone-input.component';
import { PayPalButtonComponent } from '../paypal/paypal-button/paypal-button.component';
import { Order } from '../order/order.model';
import { UpdateOrderRequest } from '../order/update-order-request.model';
import { MatCheckbox } from '@angular/material/checkbox';

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
    PersonNameDirective,
    MatInput,
    AddressDirective,
    CityDirective,
    ZipCodeDirective,
    EmailDirective,
    PhoneInputComponent,
    PayPalButtonComponent,
    MatCheckbox,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private readonly cartService = inject(CartItemService);
  private readonly orderService = inject(OrderService);
  private readonly messageService = inject(MessageService);
  private readonly auth = inject(AuthService);

  readonly checkoutForm = new FormGroup({
    buyerEmail: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    addressLine1: new FormControl('', Validators.required),
    addressLine2: new FormControl<string | null>(null),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    phone: new FormControl('', Validators.required),
    policiesAccepted: new FormControl(false, Validators.requiredTrue),
  });

  readonly states = US_STATES;

  readonly createdOrder = signal<Order | null>(null);

  placeOrUpdateOrder() {
    if (this.checkoutForm.valid) {
      if (this.createdOrder() === null) {
        const req = this.extractFormValues();

        this.orderService.createOrder(req).subscribe({
          next: (order) => this.createdOrder.set(order),
          error: () => this.messageService.error('Could not place order.'),
        });
      } else {
        this.updateOrder();
      }
    }
  }

  get orderTotal(): number {
    return this.subtotal + (this.orderTax ?? 0) + (this.orderShippingCost ?? 0);
  }

  get orderShippingCost(): number | null {
    return this.createdOrder()?.shippingCost ?? null;
  }

  get orderTax(): number | null {
    return this.createdOrder()?.tax ?? null;
  }

  private updateOrder() {
    const order = this.createdOrder();

    if (order) {
      const updates = this.getFormUpdates();

      // Send a request to update the current order
      this.orderService.updateOrderDetails(order.id, updates).subscribe({
        next: (order) => this.createdOrder.set(order),
        error: () => this.messageService.error('Could not update order.'),
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

  canExit(): boolean {
    return !this.checkoutForm.dirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.canExit()) {
      event.preventDefault();
    }
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

  private getFormUpdates(): UpdateOrderRequest {
    const req: UpdateOrderRequest = {
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
    };

    return req;
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
      subtotal: this.subtotal,
      acceptedTerms: this.checkoutForm.get('policiesAccepted')!.value!,
    };

    return req;
  }
}
