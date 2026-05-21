import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHeaderComponent } from './top-header.component';
import { provideRouter } from '@angular/router';
import { ArtistPageService } from '../artist-page/service/artist-page.service';
import { of } from 'rxjs';

describe('TopHeaderComponent', () => {
  let component: TopHeaderComponent;
  let fixture: ComponentFixture<TopHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopHeaderComponent],
      providers: [
        provideRouter([]),
        {
          provide: ArtistPageService,
          useValue: {
            getArtistPages: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
