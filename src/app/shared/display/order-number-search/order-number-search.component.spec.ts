import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNumberSearchComponent } from './order-number-search.component';

describe('OrderNumberSearchComponent', () => {
  let component: OrderNumberSearchComponent;
  let fixture: ComponentFixture<OrderNumberSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderNumberSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderNumberSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
