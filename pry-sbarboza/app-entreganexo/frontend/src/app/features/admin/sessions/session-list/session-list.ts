import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { UserSession } from '../../../../core/models/session.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { SessionApi } from '../session-api';

type SessionState = { label: string; severity: 'success' | 'secondary' | 'warn' };

@Component({
  selector: 'app-session-list',
  imports: [DatePipe, ButtonModule, MessageModule, TableModule, TagModule, TooltipModule, EmptyState, PageHeader],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css',
})
export class SessionList {
  private readonly api = inject(SessionApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  readonly rows = signal<UserSession[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly activeCount = computed(() => this.rows().filter((row) => this.isOpen(row)).length);
  readonly closedCount = computed(() => this.rows().length - this.activeCount());

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (rows) => {
        // Abiertas primero; dentro de cada grupo, la más reciente arriba.
        const sorted = [...rows].sort(
          (a, b) =>
            Number(this.isOpen(b)) - Number(this.isOpen(a)) ||
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
        );
        this.rows.set(sorted);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  isOpen(row: UserSession): boolean {
    return row.status === 'active' && !row.is_expired;
  }

  state(row: UserSession): SessionState {
    if (row.status !== 'active') return { label: 'Cerrada', severity: 'secondary' };
    if (row.is_expired) return { label: 'Caducada', severity: 'warn' };
    return { label: 'Abierta', severity: 'success' };
  }

  /** Convierte el user-agent guardado en algo legible: «Edge · Windows». */
  device(row: UserSession): string {
    const ua = row.device_info ?? '';
    if (!ua) return 'Desconocido';
    const browser = /Edg\//.test(ua) ? 'Edge'
      : /OPR\//.test(ua) ? 'Opera'
      : /Firefox\//.test(ua) ? 'Firefox'
      : /Chrome\//.test(ua) ? 'Chrome'
      : /Safari\//.test(ua) ? 'Safari'
      : /curl|PostmanRuntime|node|undici/i.test(ua) ? 'Cliente API'
      : null;
    const os = /Windows/.test(ua) ? 'Windows'
      : /Android/.test(ua) ? 'Android'
      : /iPhone|iPad/.test(ua) ? 'iOS'
      : /Mac OS X/.test(ua) ? 'macOS'
      : /Linux/.test(ua) ? 'Linux'
      : null;
    if (!browser && !os) return ua.length > 40 ? ua.slice(0, 40) + '…' : ua;
    return [browser, os].filter(Boolean).join(' · ');
  }

  revoke(row: UserSession): void {
    this.confirmation.confirm({
      header: 'Cerrar sesión',
      message: `¿Cerrar la sesión de ${this.device(row)} iniciada el ${new Date(row.createdAt ?? '').toLocaleString()}? ` +
        'Si es la de este navegador, tendrás que volver a entrar cuando caduque tu token (15 min).',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cerrar sesión',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.revoke(row.id).subscribe({
          next: () => {
            this.notify.warn('Sesión cerrada');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo cerrar', toApiMessage(error)),
        });
      },
    });
  }

  revokeAll(): void {
    this.confirmation.confirm({
      header: 'Cerrar todas las sesiones',
      message: 'Se cerrarán todas tus sesiones, también la de este navegador, y volverás al login. ' +
        'Úsalo si crees que alguien entró con tu cuenta.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cerrar todas',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.revokeAll().subscribe({
          next: (res) => {
            this.notify.warn('Sesiones cerradas', `${res.revoked} sesión(es) revocada(s). Vuelve a iniciar sesión.`);
            this.session.clear();
            void this.router.navigate(['/login']);
          },
          error: (error: unknown) => this.notify.error('No se pudieron cerrar', toApiMessage(error)),
        });
      },
    });
  }

  purge(): void {
    this.confirmation.confirm({
      header: 'Limpiar historial',
      message: `¿Borrar definitivamente las ${this.closedCount()} sesiones cerradas o caducadas? Las abiertas no se tocan.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Limpiar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.purge().subscribe({
          next: (res) => {
            this.notify.success('Historial limpio', `${res.purged} sesión(es) borrada(s).`);
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo limpiar', toApiMessage(error)),
        });
      },
    });
  }
}
