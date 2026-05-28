import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChangePasswordRequest } from './change-password-request.model';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly http = inject(HttpClient);

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
   * @returns
   */
  refreshCurrentSession(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/refresh`, {});
  }

  /**
   * Unauthenticates the currently logged-in client.
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {});
  }
}
