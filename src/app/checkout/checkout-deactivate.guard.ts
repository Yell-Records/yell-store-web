import { CanDeactivateFn } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { inject } from '@angular/core';
import { ConfirmDialogService } from '../shared/dialogs/confirm-dialog.service';
import { map } from 'rxjs';

/**
 * Prevents leaving checkout if the user has entered any information into the form.
 *
 * @param component
 * @returns
 */
export const checkoutDeactivateGuard: CanDeactivateFn<CheckoutComponent> = (component) => {
  if (component.canExit()) {
    return true;
  }

  const confirmDialog = inject(ConfirmDialogService);

  const leaveMessage = 'You have unsaved changes. Are you sure you want to leave checkout?';

  return confirmDialog
    .confirm(leaveMessage, { title: 'Leave Page?' })
    .pipe(map((confirmed) => confirmed));
};
