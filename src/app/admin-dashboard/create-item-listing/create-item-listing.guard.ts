import { CanDeactivateFn } from '@angular/router';
import { CreateItemListingComponent } from './create-item-listing.component';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { ConfirmDialogService } from '../../shared/dialogs/confirm-dialog.service';

export const createItemListingGuard: CanDeactivateFn<CreateItemListingComponent> = (
  component: CreateItemListingComponent,
) => {
  if (component.canDeactivate()) {
    return true;
  }

  const confirmDialog = inject(ConfirmDialogService);

  return confirmDialog
    .confirm('You have unsaved changes. Leave this page?')
    .pipe(map((confirmed) => confirmed));
};
