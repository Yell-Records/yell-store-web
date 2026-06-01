import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { expect } from 'chai';
import { User } from '../users/user.model';
import { ChangePasswordRequest } from './change-password-request.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const sampleUser: User = {
    username: 'test',
    email: 'test@tester.com',
    id: '1',
    role: 'user',
    createdAt: '2026-01-01 00:00:0000',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: provideHttpClientTesting(),
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST to login', () => {
    const username = 'test123';
    const password = 'pass123';

    service.login(username, password).subscribe((res) => {
      expect(res).to.deep.equal(sampleUser);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/login`);
    expect(req.request.method).to.equal('POST');

    req.flush(sampleUser);
  });

  it('should PATCH to change user password', () => {
    const sampleRequest: ChangePasswordRequest = {
      rawCurrent: 'pass123',
      rawNew: '321pass',
      rawNew2: '321pass',
    };

    service.changeUserPassword('123', sampleRequest).subscribe();

    const req = httpMock.expectOne(`${service.baseUrl}/user/123/change-password`);
    expect(req.request.method).to.equal('PATCH');

    req.flush(null);
  });

  it('should GET current user', () => {
    service.getCurrentUser().subscribe((res) => {
      expect(res).to.deep.equal(sampleUser);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/me`);
    expect(req.request.method).to.equal('GET');

    req.flush(sampleUser);
  });

  it('should POST to refresh session', () => {
    service.refreshCurrentSession().subscribe();

    const req = httpMock.expectOne(`${service.baseUrl}/refresh`);
    expect(req.request.method).to.equal('POST');

    req.flush(null);
  });

  it('should POST to logout session', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne(`${service.baseUrl}/logout`);
    expect(req.request.method).to.equal('POST');

    req.flush(null);
  });
});
