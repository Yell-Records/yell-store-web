import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPolicyComponent } from './edit-policy.component';
import { provideRouter } from '@angular/router';

describe('EditPolicyComponent', () => {
  let component: EditPolicyComponent;
  let fixture: ComponentFixture<EditPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPolicyComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPolicyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
