import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemComponent } from './order-item.component';
import { OrderItem } from './order-item.model';

describe('OrderItemComponent', () => {
  let component: OrderItemComponent;
  let fixture: ComponentFixture<OrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemComponent);
    component = fixture.componentInstance;

    const sampleItem: OrderItem = {
      id: '123',
      listingId: '1',
      quantity: 1,
      listingPrice: 1.0,
      listingTitle: 'TestListing',
      listingImageUrl: '',
      listingDescription: '',
    };

    component.itemInfo = sampleItem;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
