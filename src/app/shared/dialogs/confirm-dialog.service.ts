import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog/confirm-dialog.component';
import { ConfirmDialogOptions } from './confirm-dialog-options.model';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  /**
   * Prompts the user a confirmation dialog.
   *
   * @param message Text to show in the dialog content.
   * @param options Additional configurations to use.
   * @returns Observable answering if the user wants to proceed.
   */
  confirm(message: string, options: Partial<ConfirmDialogOptions> = {}): Observable<boolean> {
    const finalOptions: ConfirmDialogOptions = {
      title: 'Confirmation',
      confirmBtn: 'Confirm',
      cancelBtn: 'Cancel',
      ...options,
    };

    const data: ConfirmDialogData = {
      title: finalOptions.title,
      message: message,
      confirm: finalOptions.confirmBtn,
      cancel: finalOptions.cancelBtn,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: data,
      width: '400px',
      disableClose: true,
    });

    return dialogRef.afterClosed();
  }
}
