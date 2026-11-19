import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth';
import { toApiMessage } from '../../../core/utils/api-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, MessageModule],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div class="card w-full max-w-md p-8">
        <h1 class="text-2xl font-bold text-center text-slate-900 mb-6">StoreLab Express II</h1>
        
        @if (error()) {
          <p-message severity="error" styleClass="mb-4 w-full">{{ error() }}</p-message>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="field-label">Usuario o Email</label>
            <input pInputText formControlName="identifier" class="w-full" />
          </div>
          <div>
            <label class="field-label">Contraseña</label>
            <p-password formControlName="password" [feedback]="false" [toggleMask]="true" styleClass="w-full" />
          </div>
          <button pButton type="submit" label="Iniciar Sesión" class="w-full mt-4" [loading]="loading()"></button>
        </form>
      </div>
    </div>
  `
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    const { identifier, password } = this.form.getRawValue();

    this.auth.login({ identifier, password }).subscribe({
      next: () => {
        const requested = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        const returnUrl = requested.startsWith('/') && !requested.startsWith('/login') ? requested : '/dashboard';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(toApiMessage(error));
      },
    });
  }
}
