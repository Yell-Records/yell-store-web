import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArtistPageComponent } from './add-artist-page.component';
import { provideRouter } from '@angular/router';
import { CategoryService } from '../../categories/category.service';
import { of } from 'rxjs';

describe('AddArtistPageComponent', () => {
  let component: AddArtistPageComponent;
  let fixture: ComponentFixture<AddArtistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddArtistPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: CategoryService,
          useValue: {
            getAllCategories: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddArtistPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
