import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArtistPage } from './artist-page.model';
import { CreateArtistPageRequest } from './create-artist-page-request.model';
import { UpdateArtistPageRequest } from './update-artist-page-request.model';

@Injectable({
  providedIn: 'root',
})
export class ArtistPageService {
  readonly baseUrl = `${environment.apiUrl}/artist-pages`;

  private readonly http = inject(HttpClient);

  /**
   * Gets all artist pages.
   *
   * @returns
   */
  getArtistPages(): Observable<ArtistPage[]> {
    return this.http.get<ArtistPage[]>(this.baseUrl);
  }

  /**
   * Gets an artist page matching a slug.
   *
   * @param slug Artist page slug.
   * @returns
   */
  getArtistPageBySlug(slug: string): Observable<ArtistPage> {
    return this.http.get<ArtistPage>(`${this.baseUrl}/slug/${slug}`);
  }

  /**
   * Creates a new artist page. Requires administrator permission.
   *
   * @param request
   * @returns
   */
  createArtistPage(request: CreateArtistPageRequest): Observable<ArtistPage> {
    return this.http.post<ArtistPage>(this.baseUrl, request);
  }

  /**
   * Updates information on an artist page. Requires administrator permission.
   *
   * @param pageId
   * @param updates
   * @returns
   */
  updateArtistPage(pageId: string, updates: UpdateArtistPageRequest): Observable<ArtistPage> {
    return this.http.patch<ArtistPage>(`${this.baseUrl}/${pageId}`, updates);
  }

  /**
   * Deletes an artist page. Requires administrator permission.
   *
   * @param pageId
   * @returns
   */
  deleteArtistPage(pageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${pageId}`);
  }
}
