import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../../core/models/api.model';
import { User, UserPayload } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, SelectModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  readonly user = input<User | null>(null);
  readonly saving = input(false);
  readonly saved = output<UserPayload>();
  readonly cancelled = output<void>();
  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    avatar: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.user();
      this.form.reset({
        username: current?.username ?? '',
        email: current?.email ?? '',
        password: '',
        avatar: current?.avatar ?? '',
        status: current?.status ?? 'active',
      });
      // PATCH /api/usuarios/:id solo acepta username, email y avatar:
      // la contraseña y el estado se muestran únicamente al crear.
      const password = this.form.controls.password;
      if (current) {
        password.clearValidators();
        password.disable();
        this.form.controls.status.disable();
      } else {
        password.setValidators([Validators.required, Validators.minLength(8)]);
        password.enable();
        this.form.controls.status.enable();
      }
      password.updateValueAndValidity();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: UserPayload = {
      username: value.username.trim(),
      email: value.email.trim(),
      avatar: value.avatar.trim() || null,
    };
    // password + status solo existen en el alta
    if (!this.user()) {
      payload.status = value.status;
      payload.password = value.password;
    }
    this.saved.emit(payload);
  }
}
