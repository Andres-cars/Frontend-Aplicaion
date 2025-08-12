import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}`, data);
  }

  updateUserEmail(id: number, email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/email/${id}`, { email });
  }

  updateUserPassword(id: number, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/password/${id}`, { password });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }
}