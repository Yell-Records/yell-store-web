import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartItemService } from '../cart/cart-item.service';
import { MessageService } from '../shared/message/message.service';
import { filter, map, take } from 'rxjs';

/**
 * Route activation guard which ensures the client's cart is not empty.
 *
 * If they do not meet the conditions, redirect them home.
 *
 * @returns
 */
export const checkoutGuard: CanActivateFn = () => {
  const messageService = inject(MessageService);
  const cartService = inject(CartItemService);
  const router = inject(Router);

  return cartService.cartLoaded$.pipe(
    filter((loaded) => loaded),
    take(1),
    map(() => {
      if (cartService.cartCount() === 0) {
        messageService.error('Your cart is empty.');
        return router.createUrlTree(['/']);
      }

      return true;
    }),
  );
};
