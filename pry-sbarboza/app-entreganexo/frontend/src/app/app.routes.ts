import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      // 1. Redirige a dashboard por defecto al entrar a la app
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      // 2. Dashboard ahora vive DENTRO del Shell (con el menú superior visible)
      {
        path: 'dashboard',
        title: 'Dashboard · EntregaNexo',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'clientes',
        title: 'Clientes · EntregaNexo',
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'tipos-producto',
        title: 'Tipos de producto · EntregaNexo',
        loadComponent: () =>
          import('./features/product-types/product-type-list/product-type-list').then(
            (m) => m.ProductTypeList,
          ),
      },
      {
        path: 'productos',
        title: 'Productos · EntregaNexo',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'ventas',
        title: 'Ventas · EntregaNexo',
        loadComponent: () =>
          import('./features/sales/sale-list/sale-list').then((m) => m.SaleList),
      },
      {
        path: 'ventas/nueva',
        title: 'Nueva venta · EntregaNexo',
        loadComponent: () =>
          import('./features/sales/sale-form/sale-form').then((m) => m.SaleForm),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];