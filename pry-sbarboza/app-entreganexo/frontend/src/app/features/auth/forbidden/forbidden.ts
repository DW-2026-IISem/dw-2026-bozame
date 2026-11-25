import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-forbidden',
  imports: [ButtonModule, RouterLink, PageHeader],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <i class="pi pi-lock text-6xl text-slate-300 mb-6"></i>
      <app-page-header title="Acceso Denegado" subtitle="No tienes los privilegios necesarios."></app-page-header>
      
      @if (permission) {
        <div class="rounded-xl bg-slate-900 px-6 py-4 mt-2 mb-6 inline-block text-left">
          <p class="text-[11px] uppercase tracking-wider text-slate-400 mb-1">Permiso requerido faltante</p>
          <code class="text-sm font-semibold text-emerald-300">{{ permission }}</code>
        </div>
      }
      <button pButton routerLink="/dashboard"><i class="pi pi-home" pButtonIcon></i><span pButtonLabel>Volver al Dashboard</span></button>
    </div>
  `
})
export class Forbidden {
  private readonly route = inject(ActivatedRoute);
  readonly permission = this.route.snapshot.queryParamMap.get('permission');
}
