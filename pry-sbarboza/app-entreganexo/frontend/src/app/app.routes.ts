import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'clientes' }, // redirige a clientes por ahora
      {
        path: 'clientes',
        title: 'Clientes · EntregaNexo',
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then((m) => m.ClientList),
      }
    ],
  },
  { path: '**', redirectTo: '' },
  {
    path: 'tipos-producto',
    title: 'Tipos de producto · EntregaNexo',
    loadComponent: () =>
      import('./features/product-types/product-type-list/product-type-list').then(
        (m) => m.ProductTypeList,
      ),
  },
];