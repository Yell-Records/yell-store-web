import { Component, inject, OnInit, signal } from '@angular/core';
import { ArtistPageService } from '../artist-page/service/artist-page.service';
import { ArtistPage } from '../artist-page/service/artist-page.model';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '../shared/message/message.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-artists-list-page',
  imports: [MatProgressSpinner, RouterLink],
  templateUrl: './artists-list-page.component.html',
  styleUrl: './artists-list-page.component.scss',
})
export class ArtistsListPageComponent implements OnInit {
  private readonly artistService = inject(ArtistPageService);
  private readonly messageService = inject(MessageService);

  private readonly _artists = signal<ArtistPage[]>([]);

  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadArtists();
  }

  get artists(): ArtistPage[] {
    return this._artists();
  }

  private loadArtists() {
    this.artistService
      .getArtistPages()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (artists) => this._artists.set(artists),
        error: (err: HttpErrorResponse) => this.messageService.error(err.message),
      });
  }
}
