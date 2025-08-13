import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  updatePerson(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/person/${id}`, data);
  }

  changeImage(id: number, file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    return this.http.put(`${this.apiUrl}/update/image/${id}`, form);
  }
}
