import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SessionStore } from '../../../core/services/session-store';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-user-profile',
  imports: [ButtonModule, TableModule, TagModule, PageHeader],
  template: `
    <app-page-header title="Perfil y Permisos" subtitle="Auditoría de sesión y privilegios activos en el token JWT."></app-page-header>

    <div class="card mb-6">
      <div class="card-body space-y-3">
        <h3 class="text-base font-semibold text-slate-800">Información del Usuario</h3>
        <p class="text-sm text-slate-600"><strong>Roles actuales:</strong> <p-tag [value]="session.roles().join(', ') || 'Invitado'" severity="info" [rounded]="true" /></p>
        <p class="text-sm text-slate-600"><strong>Permisos totales asignados:</strong> {{ session.permissions().length }} permisos cargados.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-body space-y-4">
        <h3 class="text-base font-semibold text-slate-800">Listado de Permisos Activos</h3>
        <p-table [value]="session.permissions()" [paginator]="true" [rows]="10" [tableStyle]="{ 'min-width': '100%' }">
          <ng-template pTemplate="header">
            <tr>
              <th>Permiso / Endpoint</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-permission>
            <tr>
              <td><code>{{ permission }}</code></td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td class="text-center py-4 text-slate-400">No hay permisos registrados en la sesión.</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class UserProfile {
  readonly session = inject(SessionStore);
}
