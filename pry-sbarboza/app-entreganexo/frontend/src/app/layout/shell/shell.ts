import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuItem } from 'primeng/api';
import { SessionStore } from '../../core/services/session-store';
import { AuthService } from '../../core/services/auth';

type NavGroup = { label: string; items: { label: string; routerLink: string; permission?: string }[] };

const NAV: NavGroup[] = [
  {
    label: 'Operación',
    items: [
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Clientes', routerLink: '/clientes', permission: 'GET /api/clientes' },
      { label: 'Tipos de Producto', routerLink: '/tipos-producto', permission: 'GET /api/tipos-producto' },
      { label: 'Productos', routerLink: '/productos', permission: 'GET /api/productos' },
      { label: 'Ventas', routerLink: '/ventas', permission: 'GET /api/ventas' },
      { label: 'Perfil', routerLink: '/perfil' },
    ],
  },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ButtonModule, MenuModule, TagModule, ToastModule, ConfirmDialogModule],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col">
      <p-toast />
      <p-confirmdialog />
      <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-6">
          <span class="text-xl font-bold tracking-tight text-slate-900">EntregaNexo</span>
          <nav class="flex gap-4 text-sm font-medium text-slate-600">
            @for (group of navGroups(); track group.label) {
              @for (item of group.items; track item.label) {
                <a [routerLink]="item.routerLink" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 transition-colors">{{ item.label }}</a>
              }
            }
          </nav>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-slate-900">{{ session.user()?.username || 'Invitado' }}</p>
            <p-tag [value]="session.roleNames().join(', ') || 'Sin Rol'" severity="info" [rounded]="true" />
          </div>
          <button pButton icon="pi pi-user" severity="secondary" rounded outlined (click)="userMenuPanel.toggle($event)"></button>
          <p-menu #userMenuPanel [model]="userMenu()" [popup]="true" />
        </div>
      </header>
      <main class="flex-1 p-6 max-w-7xl w-full mx-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class Shell {
  readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly navGroups = computed(() =>
    NAV.map((group) => ({
      label: group.label,
      items: group.items.filter((item) => !item.permission || this.session.canPermission(item.permission))
    })).filter((group) => group.items.length > 0)
  );

  readonly userMenu = computed<MenuItem[]>(() => [
    { label: 'Mi Perfil', icon: 'pi pi-user', routerLink: '/perfil' },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }
  ]);

  logout(): void {
    this.auth.logout().subscribe({
      next: () => void this.router.navigate(['/login'])
    });
  }
}