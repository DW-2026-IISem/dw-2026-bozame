import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col">
      <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-6">
          <span class="text-xl font-bold tracking-tight text-slate-900">EntregaNexo</span>
          <nav class="flex gap-4 text-sm font-medium text-slate-600">
            <a routerLink="/clientes" class="hover:text-slate-900">Clientes</a>
            <a routerLink="/productos" class="hover:text-slate-900">Productos</a>
            <a routerLink="/ventas" class="hover:text-slate-900">Ventas</a>
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
