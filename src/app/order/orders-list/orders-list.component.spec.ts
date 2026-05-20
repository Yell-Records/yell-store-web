import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersListComponent } from './orders-list.component';
import { Order } from '../order.model';
import { OrderStatus } from '../order-status.type';
import { provideRouter } from '@angular/router';

describe('OrdersListComponent', () => {
  let component: OrdersListComponent;
  let fixture: ComponentFixture<OrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersListComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const sampleOrder: Order = {
      id: '1',
      orderNumber: 123,
      buyerEmail: 'email@test.com',
      status: OrderStatus.AWAITING_PAYMENT,
      shippingCost: 5.0,
      tax: 1.0,
      subtotal: 2.0,
      totalPaid: 12.0,
      shippingFirstname: 'test',
      shippingLastname: 'guy',
      shippingAddressLine1: '123 Road Lane',
      shippingAddressLine2: null,
      shippingCity: 'Quahog',
      shippingState: 'Rhode Island',
      shippingPhone: '5552981029',
      shippingPostalCode: '61029',
      createdAt: '',
      orderItems: [],
      trackingNumber: null,
      paidAt: null,
      shippedAt: null,
      anonymized: false,
      anonymizedAt: null,
      policiesAcceptedAt: '000000000000',
    };

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
    component.orders = [sampleOrder];

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
