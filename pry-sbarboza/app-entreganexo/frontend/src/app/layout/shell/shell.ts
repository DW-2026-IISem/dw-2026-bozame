import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastModule, ConfirmDialogModule],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col">
      <p-toast />
      <p-confirmdialog />
      <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-6">
          <span class="text-xl font-bold tracking-tight text-slate-900">EntregaNexo</span>
          <nav class="flex gap-4 text-sm font-medium text-slate-600">
            <a routerLink="/dashboard" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 transition-colors">Dashboard</a>
            <a routerLink="/clientes" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 transition-colors">Clientes</a>
            <a routerLink="/tipos-producto" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 transition-colors">Tipos de Producto</a>
            <a routerLink="/productos" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 transition-colors">Productos</a>
            <a routerLink="/ventas" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 transition-colors">Ventas</a>
          </nav>
        </div>
      </header>
      <main class="flex-1 p-6 max-w-7xl w-full mx-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class Shell {}
