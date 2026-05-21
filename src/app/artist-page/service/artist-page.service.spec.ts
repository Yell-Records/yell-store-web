import { TestBed } from '@angular/core/testing';

import { ArtistPageService } from './artist-page.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ArtistPage } from './artist-page.model';
import { CreateArtistPageRequest } from './create-artist-page-request.model';
import { UpdateArtistPageRequest } from './update-artist-page-request.model';

describe('ArtistPageService', () => {
  let service: ArtistPageService;
  let httpMock: HttpTestingController;

  const sampleArtistPage: ArtistPage = {
    id: '123',
    name: 'Sample Artist',
    slug: 'sample-artist',
    bodyHtml: '<p>Sample artist page works!</p>',
    categorySlug: '1',
    createdAt: '0000000000',
    updatedAt: '0000000000',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: provideHttpClientTesting(),
    });

    service = TestBed.inject(ArtistPageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET all artist pages', () => {
    service.getArtistPages().subscribe((res) => {
      expect(res).to.deep.equal([sampleArtistPage]);
    });

    const req = httpMock.expectOne(service.baseUrl);
    expect(req.request.method).to.equal('GET');

    req.flush([sampleArtistPage]);
  });

  it('should GET artist page by slug', () => {
    const slug = 'sample-artist';

    service.getArtistPageBySlug(slug).subscribe((res) => {
      expect(res).to.deep.equal(sampleArtistPage);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/slug/${slug}`);
    expect(req.request.method).to.equal('GET');

    req.flush(sampleArtistPage);
  });

  it('should POST to create artist page', () => {
    const createReq: CreateArtistPageRequest = {
      name: 'new artist',
      slug: 'new-artist',
      bodyHtml: '<p>new page</p>',
      categorySlug: 'vinyls',
    };

    service.createArtistPage(createReq).subscribe((res) => {
      expect(res).to.deep.equal(sampleArtistPage);
    });

    const req = httpMock.expectOne(service.baseUrl);
    expect(req.request.method).to.equal('POST');
    expect(req.request.body).to.equal(createReq);

    req.flush(sampleArtistPage);
  });

  it('should PATCH to update artist page', () => {
    const updateReq: UpdateArtistPageRequest = {
      slug: 'new-slug',
      name: 'Correct Artist',
    };

    service.updateArtistPage(sampleArtistPage.id, updateReq).subscribe();

    const req = httpMock.expectOne(`${service.baseUrl}/${sampleArtistPage.id}`);
    expect(req.request.method).to.equal('PATCH');
    expect(req.request.body).to.equal(updateReq);

    req.flush(null);
  });

  it('should DELETE to delete artist page', () => {
    service.deleteArtistPage(sampleArtistPage.id).subscribe();

    const req = httpMock.expectOne(`${service.baseUrl}/${sampleArtistPage.id}`);
    expect(req.request.method).to.equal('DELETE');

    req.flush(null);
  });
});
