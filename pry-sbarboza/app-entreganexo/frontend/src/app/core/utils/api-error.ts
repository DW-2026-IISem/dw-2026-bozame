import { HttpErrorResponse } from '@angular/common/http';

export function toApiMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: string; message?: string | string[]; detail?: string } | string | null;
    if (error.status === 0) {
      return 'No se pudo conectar con el backend. Verifica que esté corriendo en http://localhost:3002.';
    }
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object') {
      if (Array.isArray(body.message)) return body.message.join(', ');
      if (typeof body.message === 'string') return body.message;
      if (body.error) return body.detail ? `${body.error} —${body.detail}` : body.error;
    }
    return error.message;
  }
  return error instanceof Error ? error.message : 'Error inesperado';
}
