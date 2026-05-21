import { Component, inject, OnInit } from '@angular/core';
import { ItemListingService } from '../../item-listings/item-listing.service';
import { Paginator } from '../../shared/utils/paginator';
import { ItemListing } from '../../item-listings/item-listing.model';
import { RouterLink } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-item-listings-list',
  imports: [RouterLink, MatPaginator],
  templateUrl: './item-listings-list.component.html',
  styleUrl: './item-listings-list.component.scss',
})
export class ItemListingsListComponent implements OnInit {
  private readonly itemListingService = inject(ItemListingService);

  readonly paginatorListings = new Paginator<ItemListing>(20);

  ngOnInit(): void {
    this.itemListingService.getAllListings().subscribe({
      next: (listings) => this.paginatorListings.setItems(listings),
    });
  }
}
