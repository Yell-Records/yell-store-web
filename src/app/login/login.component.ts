import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserStore } from '../core/stores/user.store';
import { MessageService } from '../shared/message/message.service';
import { finalize } from 'rxjs';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

const loginCooldownUntil = 'loginCooldownUntil';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinner,
    MatCard,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  readonly btnLoginDisabled = signal(true);
  readonly loading = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly userStore = inject(UserStore);

  readonly isTooManyReq = signal(localStorage.getItem(loginCooldownUntil) !== null);

  readonly cooldownSeconds = signal(0);
  readonly cooldownActive = signal(false);

  constructor() {
    effect(() => {
      // Refreshes the 429 status
      if (!this.isTooManyReq()) return;

      const interval = setInterval(() => {
        const storedTime = localStorage.getItem(loginCooldownUntil);

        if (!storedTime) {
          this.end429Status();
          clearInterval(interval);
          return;
        }

        const remainingMs = Number(storedTime) - Date.now();

        if (remainingMs <= 0) {
          this.end429Status();
          clearInterval(interval);
          return;
        }
      });
    });
  }

  formValid(): boolean {
    this.btnLoginDisabled.set(!this.loginForm.valid);

    return this.loginForm.valid;
  }

  login() {
    if (this.loginForm.valid && !this.isTooManyReq()) {
      const username = this.loginForm.value.username!;
      const password = this.loginForm.value.password!;

      this.sendLoginReq(username, password);
    }
  }

  private sendLoginReq(username: string, password: string) {
    this.loading.set(true);

    this.authService
      .login(username, password)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.authService.setToken(res.token);
          this.userStore.init();
          this.router.navigate(['/home']);
        },
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 400:
              this.messageService.error('Invalid credentials');
              break;
            case 429:
              this.messageService.error('Too many login attempts. Please try again later.');
              if (!this.isTooManyReq()) {
                this.start429Status();
              }
              break;
            default:
              this.messageService.error(err.message);
          }
        },
      });
  }

  private start429Status() {
    localStorage.setItem(loginCooldownUntil, String(Date.now() + 60_000));
    this.isTooManyReq.set(true);
  }

  private end429Status() {
    localStorage.removeItem(loginCooldownUntil);
    this.isTooManyReq.set(false);
  }
}
