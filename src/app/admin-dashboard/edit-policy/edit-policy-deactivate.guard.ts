import { CanDeactivateFn } from '@angular/router';
import { EditPolicyComponent } from './edit-policy.component';
import { inject } from '@angular/core';
import { ConfirmDialogService } from '../../shared/dialogs/confirm-dialog.service';
import { map } from 'rxjs';

export const editPolicyDeactivateGuard: CanDeactivateFn<EditPolicyComponent> = (component) => {
  if (component.canExit()) {
    return true;
  }

  const confirmDialog = inject(ConfirmDialogService);

  const leaveMessage = 'You have unsaved changes. Are you sure you want to leave?';

  return confirmDialog
    .confirm(leaveMessage, { title: 'Leave Page?' })
    .pipe(map((confirmed) => confirmed));
};
