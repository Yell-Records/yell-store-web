import { Injectable, signal } from '@angular/core';

/**
 * Service class for overriding exit navigation at checkout.
 */
@Injectable({
  providedIn: 'root',
})
export class CheckoutNavigationService {
  private readonly _allowExit = signal(false);

  /**
   * Enables navigation exit override for checkout.
   */
  allowExit() {
    this._allowExit.set(true);
  }

  /**
   * Resets the navigation override for checkout and enables normal status
   * checks for leaving the page.
   */
  reset() {
    this._allowExit.set(false);
  }

  /**
   * Checks if the exit navigation override is active.
   *
   * @returns
   */
  canExit(): boolean {
    return this._allowExit();
  }
}
