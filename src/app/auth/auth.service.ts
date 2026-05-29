import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChangePasswordRequest } from './change-password-request.model';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly http = inject(HttpClient);

  private readonly _isLoggedIn = signal(false);

  /** Local storage identifier for marking the current login status. */
  static readonly LOGIN_FLAG = 'isLoggedIn';

  constructor() {
    this.initLoginStatus();
  }

  private initLoginStatus() {
    const status = localStorage.getItem(AuthService.LOGIN_FLAG);

    if (status) {
      this._isLoggedIn.set(status === 'true');
    } else {
      localStorage.setItem(AuthService.LOGIN_FLAG, 'false');
    }
  }

  /**
   * Reads a signal to determine if the client session claims to be a logged-in user.
   * The default value of the signal uses a flag from local storage.
   *
   * ### WARNING
   * This does NOT check authentication. It only indicates whether a user profile is
   * currently / was loaded into memory. If you want to check for authentication, use
   * `UserStore.hasUser()`.
   *
   * @returns true if the client has credentials provided.
   */
  isLoggedIn(): boolean {
    return this._isLoggedIn();
  }

  /**
   * Updates login status on a signal and an item in local storage.
   *
   * @param value Value to update the login status to
   */
  setLoginStatus(value: boolean) {
    localStorage.setItem(AuthService.LOGIN_FLAG, value ? 'true' : 'false');
    this._isLoggedIn.set(value);
  }

  /**
   * Attempts to validate the provided credentials against an existing user in the database.
   *
   * ### Error codes
   * - 400 (Bad Request) - If ANY of the parameters are mismatched.
   *
   * @param username User to login as.
   * @param rawPassword Password of the user.
   * @returns User details on successful login
   */
  login(username: string, rawPassword: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, { username, rawPassword });
  }

  /**
   * Sends a request to change the password on a user account. Requires authentication.
   *
   * @param userId ID of user to change password on
   * @param changeRequest
   * @returns
   */
  changeUserPassword(userId: string, changeRequest: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/user/${userId}/change-password`, changeRequest);
  }

  /**
   * Gets the currently authenticated user. Components should NOT use this function when attempting
   * to validate the current user.
   *
   * @returns
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  /**
   * Sends a refresh call to the backend to keep the current authenticated user's session alive.
   *
   * @returns true on success
   */
  refreshCurrentSession(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/refresh`, {});
  }

  /**
   * Unauthenticates the currently logged-in client.
   */
  logout(): Observable<void> {
    this.setLoginStatus(false);
    return this.http.post<void>(`${this.baseUrl}/logout`, {});
  }
}
