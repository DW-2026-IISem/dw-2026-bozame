import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../../core/models/api.model';
import { HTTP_METHODS, HttpMethod, Resource, ResourcePayload } from '../../../../core/models/resource.model';

@Component({
  selector: 'app-resource-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.css',
})
export class ResourceForm {
  readonly resource = input<Resource | null>(null);
  readonly saving = input(false);
  readonly saved = output<ResourcePayload>();
  readonly cancelled = output<void>();
  private readonly fb = inject(NonNullableFormBuilder);

  readonly methodOptions = HTTP_METHODS.map((method) => ({ label: method, value: method }));
  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    // La ruta empieza por `/`; para parámetros se usa `:id` (/api/clientes/:id).
    path: ['', [Validators.required, Validators.pattern(/^\/.*$/)]],
    method: ['GET' as HttpMethod, [Validators.required]],
    description: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.resource();
      this.form.reset({
        path: current?.path ?? '',
        method: current?.method ?? 'GET',
        description: current?.description ?? '',
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
      path: value.path.trim(),
      method: value.method,
      description: value.description.trim() || null,
      ...(this.resource() ? {} : { status: value.status }),
    });
  }
}
