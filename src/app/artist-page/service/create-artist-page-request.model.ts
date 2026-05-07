export interface CreateArtistPageRequest {
  slug: string;
  name: string;
  bodyHtml: string;
  youtubeUrls: string[];
  categorySlug: string;
}
