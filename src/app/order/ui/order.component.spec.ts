import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComponent } from './order.component';
import { Order } from '../order.model';
import { OrderStatus } from '../order-status.type';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;

    const sampleOrder: Order = {
      id: '1',
      buyerEmail: 'email@test.com',
      status: OrderStatus.AWAITING_PAYMENT,
      totalPaid: 50.0,
      shippingFirstname: 'john',
      shippingLastname: 'smith',
      shippingAddressLine1: '123 Lane',
      shippingAddressLine2: null,
      shippingCity: 'Salt Lake City',
      shippingState: 'New York',
      shippingPostalCode: '65728',
      shippingPhone: '5552931029',
      createdAt: '',
      orderItems: [],
      trackingCarrier: null,
      trackingNumber: null,
      shippedAt: null,
      paidAt: null,
      subtotal: 1,
      shippingCost: 1,
      tax: 1,
    };

    component.order = sampleOrder;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
