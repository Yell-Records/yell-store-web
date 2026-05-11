import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Order } from './order.model';
import { CreateOrderRequest } from './create-order-request.model';
import { OrderStatus } from './order-status.type';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const sampleOrder: Order = {
    id: '1',
    buyerEmail: 'email@test.com',
    status: OrderStatus.AWAITING_PAYMENT,
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
    trackingCarrier: null,
    trackingNumber: null,
    paidAt: null,
    shippedAt: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: provideHttpClientTesting(),
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function expectRelevantOrders(unfinished: boolean) {
    service.getOrders(unfinished).subscribe((res) => {
      expect(res).to.deep.equal([sampleOrder]);
    });

    const req = httpMock.expectOne(`${service.baseUrl}?unfinished=${unfinished}`);
    expect(req.request.method).to.equal('GET');
    expect(req.request.params.get('unfinished')).toBe(`${unfinished}`);

    req.flush([sampleOrder]);
  }

  it('should GET /sellerId/:sellerId relevant seller orders unfinished', () =>
    expectRelevantOrders(true));

  it('should GET /sellerId/:sellerId relevant seller orders finished', () =>
    expectRelevantOrders(false));

  it('should POST to create an order', () => {
    const createOrderReq: CreateOrderRequest = {
      buyerEmail: '1',
      guestSessionId: '123',
      totalPaid: 12.0,
      shippingFirstName: 'test',
      shippingLastName: 'guy',
      shippingAddressLine1: '123 Road Lane',
      shippingAddressLine2: null,
      shippingCity: 'Quahog',
      shippingState: 'Rhode Island',
      shippingPhone: '5552981029',
      shippingPostalCode: '61029',
    };

    service.createOrder(createOrderReq).subscribe((res) => {
      expect(res).to.deep.equal(sampleOrder);
    });

    const req = httpMock.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).to.deep.equal(createOrderReq);

    req.flush(sampleOrder);
  });
});
