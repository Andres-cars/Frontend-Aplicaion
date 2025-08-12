import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TypeUser {
  id: number;
  type: string;
  state?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TypeUserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Listar tipos activos
  getTypes(): Observable<TypeUser[]> {
    return this.http.get<TypeUser[]>(`${this.apiUrl}/type/users`);
  }

  // Obtener un tipo por id (el backend no expone GET por id, se resuelve por filtro en el cliente)
  getType(id: number): Observable<TypeUser | undefined> {
    return this.getTypes().pipe(map(list => list.find(t => Number(t.id) === Number(id))));
  }

  // Crear tipo
  createType(payload: { type: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/type/users`, payload);
    // Nota: según tus rutas, POST no requiere token; GET/PUT/DELETE sí usan verifyToken
  }

  // Actualizar tipo
  updateType(id: number, payload: { type: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/type/users/${id}`, payload);
  }

  // Eliminar (soft delete: state=false)
  deleteType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/type/users/${id}`);
  }
}
