import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Tipos básicos sugeridos. Ajusta según tu modelo real del backend
export interface Tutoring {
  id: number;
  student_id: number;
  teacher_id: number;
  date?: string; // ISO string o fecha según tu backend
  topic?: string;
  notes?: string;
  // Cuando el backend use Sequelize include
  student?: any;
  teacher?: any;
}

export interface CreateTutoringDto {
  student_id: number;
  teacher_id: number;
  date?: string;
  topic?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class TutoringService {
  private http = inject(HttpClient);

  // Rutas candidatas (singular/plural). Se memoriza la que funcione.
  private primaryApiUrl = 'http://localhost:3000/api/tutoring';
  private secondaryApiUrl = 'http://localhost:3000/api/tutoria';
  private apiUrl = this.primaryApiUrl;

  // Helper: intenta con apiUrl actual y, si 404, prueba alternativa y memoriza
  private requestWithFallback<T>(requestFactory: (base: string) => Observable<T>): Observable<T> {
    return requestFactory(this.apiUrl).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err?.status === 404) {
          const alt = this.apiUrl === this.primaryApiUrl ? this.secondaryApiUrl : this.primaryApiUrl;
          return requestFactory(alt).pipe(
            tap(() => (this.apiUrl = alt)),
            catchError((err2: HttpErrorResponse) => this.handleError(err2))
          );
        }
        return this.handleError(err);
      })
    );
  }

  // Crear tutoría
  create(payload: CreateTutoringDto): Observable<Tutoring> {
    return this.requestWithFallback<Tutoring>((base) => this.http.post<Tutoring>(`${base}/registrar`, payload));
  }

  // Listar tutorías (permite filtros opcionales)
  list(filters?: { student_id?: number; teacher_id?: number; from?: string; to?: string }): Observable<Tutoring[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
      });
    }
    return this.requestWithFallback<Tutoring[]>((base) => this.http.get<Tutoring[]>(`${base}/obtener`, { params }));
  }

  // Actualizar tutoría (PATCH)
  update(id: number, payload: Partial<CreateTutoringDto>): Observable<Tutoring> {
    return this.requestWithFallback<Tutoring>((base) => this.http.patch<Tutoring>(`${base}/${id}`, payload));
  }

  // Eliminar tutoría
  remove(id: number): Observable<{ message?: string }> {
    return this.requestWithFallback<{ message?: string }>((base) => this.http.delete<{ message?: string }>(`${base}/${id}`));
  }

  // Reporte semanal por estudiante (semana actual en backend)
  weeklyReport(studentId: number): Observable<any> {
    return this.requestWithFallback<any>((base) => this.http.get<any>(`${base}/report/${studentId}`));
  }

  // Manejo de errores con mensajes amigables
  private handleError(error: HttpErrorResponse) {
    let userMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';

    if (error.status === 0) {
      userMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté activo.';
    } else {
      // Mensajes por código común
      switch (error.status) {
        case 400:
          userMessage = 'Datos inválidos. Revisa la información ingresada.';
          break;
        case 401:
          userMessage = 'No autorizado. Inicia sesión para continuar.';
          break;
        case 403:
          userMessage = 'Acceso denegado. No tienes permisos para esta acción.';
          break;
        case 404:
          userMessage = 'Recurso no encontrado.';
          break;
        case 409:
          userMessage = 'Conflicto de datos. Verifica los valores ingresados (ej. roles de estudiante/profesor).';
          break;
        case 422:
          userMessage = 'Error de validación. Corrige los datos y vuelve a intentar.';
          break;
        case 500:
          userMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
        default:
          userMessage = (error as any)?.error?.message || userMessage;
      }
    }

    return throwError(() => new Error(userMessage));
  }
}
