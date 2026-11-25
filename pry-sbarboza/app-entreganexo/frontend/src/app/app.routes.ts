import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { permissionGuard } from './core/guards/permission-guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar sesión · EntregaNexo',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard · EntregaNexo',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'clientes',
        title: 'Clientes · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/clientes' },
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'tipos-producto',
        title: 'Tipos de producto · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/product-types' },
        loadComponent: () =>
          import('./features/product-types/product-type-list/product-type-list').then(
            (m) => m.ProductTypeList,
          ),
      },
      {
        path: 'productos',
        title: 'Productos · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/productos' },
        loadComponent: () =>
          import('./features/products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'ventas',
        title: 'Ventas · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/ventas' },
        loadComponent: () =>
          import('./features/sales/sale-list/sale-list').then((m) => m.SaleList),
      },
      {
        path: 'ventas/nueva',
        title: 'Nueva venta · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'POST /api/ventas' },
        loadComponent: () =>
          import('./features/sales/sale-form/sale-form').then((m) => m.SaleForm),
      },
      {
        path: 'detalle-ventas',
        title: 'Detalle de ventas · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/detalle-ventas' },
        loadComponent: () =>
          import('./features/product-sales/product-sale-list/product-sale-list').then(
            (m) => m.ProductSaleList,
          ),
      },
      // ── Seguridad (Fase II · ISS-10): administración del RBAC ──
      {
        path: 'admin/usuarios',
        title: 'Usuarios · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/usuarios' },
        loadComponent: () =>
          import('./features/admin/users/user-list/user-list').then((m) => m.UserList),
      },
      {
        path: 'admin/roles',
        title: 'Roles · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/roles' },
        loadComponent: () =>
          import('./features/admin/roles/role-list/role-list').then((m) => m.RoleList),
      },
      {
        path: 'admin/recursos',
        title: 'Recursos · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/recursos' },
        loadComponent: () =>
          import('./features/admin/resources/resource-list/resource-list').then((m) => m.ResourceList),
      },
      {
        path: 'admin/asignaciones',
        title: 'Asignaciones · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/asignaciones-rol' },
        loadComponent: () =>
          import('./features/admin/role-users/role-user-list/role-user-list').then((m) => m.RoleUserList),
      },
      {
        path: 'admin/permisos',
        title: 'Permisos · EntregaNexo',
        canActivate: [permissionGuard],
        data: { permission: 'GET /api/concesiones-rol' },
        loadComponent: () =>
          import('./features/admin/resource-roles/resource-role-list/resource-role-list').then((m) => m.ResourceRoleList),
      },
      {
        // Sesiones propias (refresh_tokens): rutas JWT sin RBAC, sin permissionGuard.
        path: 'admin/sesiones',
        title: 'Mis sesiones · EntregaNexo',
        loadComponent: () =>
          import('./features/admin/sessions/session-list/session-list').then((m) => m.SessionList),
      },
      {
        path: 'perfil',
        title: 'Mi Perfil · EntregaNexo',
        // El perfil no lleva permissionGuard porque todo usuario autenticado puede verlo
        loadComponent: () =>
          import('./features/auth/user-profile/user-profile').then((m) => m.UserProfile),
      },
      {
        path: 'forbidden',
        title: 'Acceso Denegado · EntregaNexo',
        loadComponent: () => import('./features/auth/forbidden/forbidden').then((m) => m.Forbidden),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];