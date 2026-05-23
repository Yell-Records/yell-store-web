import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAnchor } from '@angular/material/button';
import { UserStore } from '../core/stores/user.store';
import { ChangePasswordRequest } from '../auth/change-password-request.model';
import { MessageService } from '../shared/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-settings',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatAnchor, MatError],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent {
  private readonly auth = inject(AuthService);
  private readonly userStore = inject(UserStore);
  private readonly messageService = inject(MessageService);

  readonly emailControl = new FormControl('', [Validators.required, Validators.email]);

  readonly changePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    {
      validators: [this.passwordsMatchValidator, this.newPasswordDifferentValidator],
    },
  );

  constructor() {
    effect(() => {
      const user = this.userStore.user();

      if (!user) return;

      this.emailControl.setValue(user.email);
    });
  }

  submitPasswordForm() {
    if (this.changePasswordForm.valid) {
      const req: ChangePasswordRequest = {
        rawCurrent: this.changePasswordForm.get('currentPassword')!.value!,
        rawNew: this.changePasswordForm.get('newPassword')!.value!,
        rawNew2: this.changePasswordForm.get('confirmPassword')!.value!,
      };

      this.auth.changeUserPassword(this.auth.userId!, req).subscribe({
        next: () => {
          this.messageService.success('Your password was changed.');
          this.changePasswordForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 400:
              this.messageService.error('Invalid password data.');
              break;
            default:
              this.messageService.error(err.message);
          }
        },
      });
    }
  }

  get passwordRules() {
    const value = this.changePasswordForm.get('newPassword')?.value || '';

    return {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
      symbol: /[\W_]/.test(value),
    };
  }

  private passwordsMatchValidator(group: AbstractControl) {
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;

    return newPass === confirm ? null : { passwordsMismatch: true };
  }

  private newPasswordDifferentValidator(group: AbstractControl) {
    const current = group.get('currentPassword')?.value;
    const next = group.get('newPassword')?.value;

    return current && next && current === next ? { samePassword: true } : null;
  }

  get username(): string {
    return this.auth.username!;
  }
}
