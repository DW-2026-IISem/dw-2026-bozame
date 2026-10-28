import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Status } from '../../../core/models/api.model';
import { Client, ClientPayload } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, TextareaModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
})
export class ClientForm {
  readonly client = input<Client | null>(null);
  readonly saving = input(false);
  readonly saved = output<ClientPayload>();
  readonly cancelled = output<void>();
  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    address: [''],
    phone: [''],
    email: ['', [Validators.email]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.client();
      this.form.reset({
        name: current?.name ?? '',
        address: current?.address ?? '',
        phone: current?.phone ?? '',
        email: current?.email ?? '',
        status: current?.status ?? 'active',
      });
      if (current) {
        this.form.controls.status.disable();
      } else {
        this.form.controls.status.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      name: value.name.trim(),
      address: value.address.trim() || null,
      phone: value.phone.trim() || null,
      email: value.email.trim() || null,
      ...(this.client() ? {} : { status: value.status }),
    });
  }
}
