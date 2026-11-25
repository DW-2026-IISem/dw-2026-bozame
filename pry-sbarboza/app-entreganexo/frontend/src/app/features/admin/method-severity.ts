import { HttpMethod } from '../../core/models/resource.model';

export type TagSeverity = 'info' | 'success' | 'warn' | 'danger' | 'secondary';

/** Semáforo de métodos HTTP para las pantallas de administración. */
export function methodSeverity(method: HttpMethod | string | undefined): TagSeverity {
  switch (method) {
    case 'GET':
      return 'info';
    case 'POST':
      return 'success';
    case 'PUT':
    case 'PATCH':
      return 'warn';
    case 'DELETE':
      return 'danger';
    default:
      return 'secondary';
  }
}
