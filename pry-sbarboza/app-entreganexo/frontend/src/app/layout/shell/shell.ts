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
import { NotificationService } from '../../core/services/notification';

type NavGroup = { label: string; items: { label: string; routerLink: string; permission?: string }[] };

const NAV: NavGroup[] = [
  {
    label: 'Operación',
    items: [
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Clientes', routerLink: '/clientes', permission: 'GET /api/clientes' },
      { label: 'Tipos de Producto', routerLink: '/tipos-producto', permission: 'GET /api/product-types' },
      { label: 'Productos', routerLink: '/productos', permission: 'GET /api/productos' },
      { label: 'Ventas', routerLink: '/ventas', permission: 'GET /api/ventas' },
      { label: 'Detalle de ventas', routerLink: '/detalle-ventas', permission: 'GET /api/detalle-ventas' },
      { label: 'Perfil', routerLink: '/perfil' },
    ],
  },
  {
    // ISS-10: administración del RBAC. Cada pantalla aparece solo con su permiso GET.
    label: 'Seguridad',
    items: [
      { label: 'Usuarios', routerLink: '/admin/usuarios', permission: 'GET /api/usuarios' },
      { label: 'Roles', routerLink: '/admin/roles', permission: 'GET /api/roles' },
      { label: 'Recursos', routerLink: '/admin/recursos', permission: 'GET /api/recursos' },
      { label: 'Asignaciones', routerLink: '/admin/asignaciones', permission: 'GET /api/asignaciones-rol' },
      { label: 'Permisos', routerLink: '/admin/permisos', permission: 'GET /api/concesiones-rol' },
      // Sin permiso: cualquier usuario autenticado puede ver y cerrar sus sesiones.
      { label: 'Mis sesiones', routerLink: '/admin/sesiones' },
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
              @if (group.label === 'Operación') {
                @for (item of group.items; track item.label) {
                  <a [routerLink]="item.routerLink" routerLinkActive="text-slate-900 font-semibold" class="hover:text-slate-900 transition-colors">{{ item.label }}</a>
                }
              } @else {
                <!-- Los demás grupos (Seguridad) se muestran como desplegable para no saturar la barra -->
                <button type="button" class="flex items-center gap-1 hover:text-slate-900 transition-colors"
                        [class.text-slate-900]="inSection(group)" [class.font-semibold]="inSection(group)"
                        (click)="securityMenuPanel.toggle($event)">
                  <i class="pi pi-shield text-xs"></i>{{ group.label }}<i class="pi pi-chevron-down text-[10px]"></i>
                </button>
                <p-menu #securityMenuPanel [model]="groupMenu(group)" [popup]="true" appendTo="body" />
              }
            }
          </nav>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-slate-900">{{ session.user()?.username || 'Invitado' }}</p>
            <p-tag [value]="session.roleNames().join(', ') || 'Sin Rol'" severity="info" [rounded]="true" />
          </div>
          <button pButton severity="secondary" rounded outlined (click)="userMenuPanel.toggle($event)"><i class="pi pi-user" pButtonIcon></i></button>
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
  private readonly notify = inject(NotificationService);

  readonly navGroups = computed(() =>
    NAV.map((group) => ({
      label: group.label,
      items: group.items.filter((item) => !item.permission || this.session.canPermission(item.permission))
    })).filter((group) => group.items.length > 0)
  );

  readonly userMenu = computed<MenuItem[]>(() => [
    { label: 'Mi Perfil', icon: 'pi pi-user', routerLink: '/perfil' },
    { label: 'Actualizar permisos', icon: 'pi pi-refresh', command: () => this.refreshPermissions() },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }
  ]);

  /** Items de un grupo del menú como `MenuItem[]` para el desplegable. */
  groupMenu(group: { items: { label: string; routerLink: string }[] }): MenuItem[] {
    return group.items.map((item) => ({ label: item.label, routerLink: item.routerLink }));
  }

  /** ¿La ruta actual pertenece a este grupo? (para resaltar el desplegable). */
  inSection(group: { items: { routerLink: string }[] }): boolean {
    return group.items.some((item) => this.router.url.startsWith(item.routerLink));
  }

  /** Vuelve a pedir perfil y permisos: el menú y los botones cambian sin recargar. */
  refreshPermissions(): void {
    this.auth.me().subscribe({
      next: (access) => this.notify.success('Permisos actualizados', `${access.permissions.length} permisos efectivos`),
      error: () => this.notify.error('No se pudieron actualizar los permisos'),
    });
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => void this.router.navigate(['/login'])
    });
  }
}