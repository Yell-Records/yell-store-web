import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyViewerComponent } from './policy-viewer.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('PolicyViewerComponent', () => {
  let component: PolicyViewerComponent;
  let fixture: ComponentFixture<PolicyViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyViewerComponent],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { file: '/assets/policies/privacy-policy.html' },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyViewerComponent);
    component = fixture.componentInstance;

    // Mock the HTTP request triggered in the constructor
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/assets/policies/privacy-policy.html').flush('<p>ok</p>');

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
