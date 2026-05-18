import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersCompletedComponent } from './orders-completed.component';
import { OrderService } from '../../order/order.service';
import { of } from 'rxjs';

describe('OrdersCompletedComponent', () => {
  let component: OrdersCompletedComponent;
  let fixture: ComponentFixture<OrdersCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersCompletedComponent],
      providers: [{ provide: OrderService, useValue: { getCompletedOrders: () => of([]) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersCompletedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
