import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersInProgressComponent } from './orders-in-progress.component';

describe('OrdersInProgressComponent', () => {
  let component: OrdersInProgressComponent;
  let fixture: ComponentFixture<OrdersInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersInProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersInProgressComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
