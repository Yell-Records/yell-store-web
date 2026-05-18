import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersInProgressComponent } from './orders-in-progress.component';
import { OrderService } from '../../order/order.service';
import { of } from 'rxjs';

describe('OrdersInProgressComponent', () => {
  let component: OrdersInProgressComponent;
  let fixture: ComponentFixture<OrdersInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersInProgressComponent],
      providers: [{ provide: OrderService, useValue: { getInProgressOrders: () => of([]) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersInProgressComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
