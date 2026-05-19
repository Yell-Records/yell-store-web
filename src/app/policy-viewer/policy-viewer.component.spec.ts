import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyViewerComponent } from './policy-viewer.component';

describe('PolicyViewerComponent', () => {
  let component: PolicyViewerComponent;
  let fixture: ComponentFixture<PolicyViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyViewerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
