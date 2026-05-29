import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../users/user.model';
import { AuthService } from '../../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

/**
 * Holds information on the current client session.
 */
@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly auth = inject(AuthService);

  private readonly guestSessionKey = 'guestSessionId';

  private readonly _user = signal<User | null>(null);
  private readonly _guestId = signal<string | null>(null);

  /**
   * Initializes the user store.
   *
   * @returns Promise from authentication service detailing the current client.
   */
  async init(): Promise<void> {
    try {
      const user = await firstValueFrom(this.auth.getCurrentUser());

      return this.initUser(user);
    } catch {
      return this.initGuest();
    }
  }

  /**
   * Checks the user signal to verify if the client is currently a logged-in session.
   *
   * @returns true if user is not null.
   */
  hasUser(): boolean {
    return this._user() !== null;
  }

  /**
   * Reads the current value from the user signal. A null value indicates a non-user.
   */
  get user(): User | null {
    return this._user();
  }

  /**
   * Reads the current guest session ID. A null value indicates a logged-in user.
   */
  get guestSessionId(): string | null {
    return this._guestId();
  }

  /**
   * Initializes a user session and clears information on the previous guest session.
   *
   * @param user User data to set.
   */
  initUser(user: User) {
    this._user.set(user);
    this._guestId.set(null);
    this.auth.setLoginStatus(true);
    localStorage.removeItem(this.guestSessionKey);
  }

  /**
   * Clears current user information and generates a new UUIDv4 session ID for the client.
   */
  initGuest() {
    this._user.set(null);

    const currentGuestId = localStorage.getItem(this.guestSessionKey);

    if (currentGuestId) {
      // Reset the value with the ID from storage
      this._guestId.set(currentGuestId);
    } else {
      // Generate a new ID
      const newId = uuidv4();

      localStorage.setItem(this.guestSessionKey, newId);
      this._guestId.set(newId);
    }

    this.auth.setLoginStatus(false);
  }
}
