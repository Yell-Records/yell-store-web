import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArtistPageComponent } from './add-artist-page.component';

describe('AddArtistPageComponent', () => {
  let component: AddArtistPageComponent;
  let fixture: ComponentFixture<AddArtistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddArtistPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddArtistPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
