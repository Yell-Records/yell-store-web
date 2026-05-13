import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPalButtonComponent } from './paypal-button.component';

describe('PayPalButtonComponent', () => {
  let component: PayPalButtonComponent;
  let fixture: ComponentFixture<PayPalButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayPalButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PayPalButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
