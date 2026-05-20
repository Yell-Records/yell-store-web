import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListingsListComponent } from './item-listings-list.component';
import { ItemListingService } from '../../item-listings/item-listing.service';
import { of } from 'rxjs';

describe('ItemListingsListComponent', () => {
  let component: ItemListingsListComponent;
  let fixture: ComponentFixture<ItemListingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemListingsListComponent],
      providers: [
        {
          provide: ItemListingService,
          useValue: {
            getAllListings: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListingsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
