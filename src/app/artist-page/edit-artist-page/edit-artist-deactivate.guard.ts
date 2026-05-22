import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ConfirmDialogService } from '../../shared/dialogs/confirm-dialog.service';
import { map } from 'rxjs';
import { EditArtistPageComponent } from './edit-artist-page.component';

/**
 * Prevents leaving the add artist page if the user has unsaved changes.
 *
 * @param component
 * @returns
 */
export const editArtistDeactivateGuard: CanDeactivateFn<EditArtistPageComponent> = (component) => {
  if (component.canExit()) {
    return true;
  }

  const confirmDialog = inject(ConfirmDialogService);

  const leaveMessage = 'You have unsaved changes. Are you sure you want to leave?';

  return confirmDialog
    .confirm(leaveMessage, { title: 'Leave Page?' })
    .pipe(map((confirmed) => confirmed));
};
