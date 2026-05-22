import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistPageService } from './service/artist-page.service';
import { ItemListingService } from '../item-listings/item-listing.service';
import { ArtistPage } from './service/artist-page.model';
import { finalize } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ItemListing } from '../item-listings/item-listing.model';
import { ItemListingListComponent } from '../item-listings/item-listing-list/item-listing-list.component';
import { Title } from '@angular/platform-browser';
import { yrTitle } from '../title/qm-title';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-artist-page',
  imports: [MatProgressSpinner, ItemListingListComponent],
  templateUrl: './artist-page.component.html',
  styleUrl: './artist-page.component.scss',
})
export class ArtistPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly artistService = inject(ArtistPageService);
  private readonly itemListingService = inject(ItemListingService);
  private readonly title = inject(Title);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly _artist = signal<ArtistPage | null>(null);
  private readonly _artistListings = signal<ItemListing[]>([]);

  readonly loading = signal(true);

  ngOnInit(): void {
    this.listenForRouteParams();
  }

  navigateEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  get artistPage(): ArtistPage | null {
    return this._artist();
  }

  get artistListings(): ItemListing[] {
    return this._artistListings();
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  private listenForRouteParams() {
    this.route.paramMap.subscribe((params) => {
      const artistSlug = params.get('artistSlug');

      if (artistSlug) {
        this.loadArtistFromSlug(artistSlug);
      }
    });
  }

  private loadArtistFromSlug(slug: string) {
    this.artistService
      .getArtistPageBySlug(slug)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (artist) => {
          this._artist.set(artist);
          this.title.setTitle(yrTitle(`Artist: ${artist.name}`));
          this.loadItemsFromCategorySlug(artist.categorySlug);
        },
      });
  }

  private loadItemsFromCategorySlug(slug: string) {
    this.itemListingService.getListingsByCategorySlug(slug).subscribe({
      next: (listings) => this._artistListings.set(listings),
    });
  }
}
