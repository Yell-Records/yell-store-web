import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../users/user.model';
import { AuthService } from '../../auth/auth.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Holds information on the current client session.
 */
@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly _user = signal<User | null>(null);
  private readonly _guestId = signal<string | null>(null);
  private readonly auth = inject(AuthService);

  private readonly guestSessionKey = 'guestSessionId';

  /**
   * Initializes the user store.
   *
   * @returns
   */
  init() {
    this.auth.getCurrentUser().subscribe({
      next: (user) => this.initUser(user),
      error: () => this.initGuest(),
    });
  }

  /**
   * Checks if the client is currently logged in.
   *
   * @returns
   */
  isLoggedIn(): boolean {
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

  initUser(user: User) {
    this._user.set(user);
    this._guestId.set(null);
  }

  /**
   * Clears current user information and generates a new UUIDv4 session ID for the client.
   */
  initGuest() {
    this._user.set(null);

    const currentId = localStorage.getItem(this.guestSessionKey) ?? null;

    if (currentId) {
      this._guestId.set(currentId);
    } else {
      const newId = uuidv4();

      localStorage.setItem(this.guestSessionKey, newId);
      this._guestId.set(newId);
    }
  }
}
