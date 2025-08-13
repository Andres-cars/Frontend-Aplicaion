import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Paso 1: credenciales
  email = '';
  password = '';

  // Paso 2: selección de rol (protegida con token tras login)
  stage: 'credentials' | 'role' = 'credentials';
  roles: { id: number; type: string }[] = [];
  selectedRoleId: number | null = null;

  error = '';

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.error = '';
        // Guardar token
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
        // Guardar información básica del usuario para perfil
        const resUser: any = res?.user ?? res?.data ?? res;
        const userId = resUser?.id ?? resUser?.user_id ?? res?.userId ?? res?.id ?? null;
        if (userId) {
          localStorage.setItem('userId', String(userId));
        }
        const userEmail = resUser?.email ?? res?.email ?? this.email ?? null;
        if (userEmail) {
          localStorage.setItem('userEmail', String(userEmail));
        }

        // Tras login exitoso, cargar roles protegidos por token
        this.fetchRolesAfterLogin();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error de login';
      }
    });
  }

  continueWithRole() {
    const role = this.roles.find(r => Number(r.id) === Number(this.selectedRoleId || -1));
    if (!role) {
      this.error = 'Seleccione un rol para continuar';
      return;
    }
    this.persistRoleAndContinue(role);
  }

  private persistRoleAndContinue(role: { id: number; type: string }) {
    localStorage.setItem('selectedRoleId', String(role.id));
    localStorage.setItem('selectedRoleName', role.type);
    this.router.navigate(['/users']);
  }

  private fetchRolesAfterLogin() {
    // Roles vienen de /api/type/users y requieren token
    fetch('http://localhost:3000/api/type/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(r => r.json())
      .then((list) => {
        if (Array.isArray(list) && list.length) {
          this.roles = list.map((r: any) => ({ id: Number(r.id), type: String(r.type) }));
          if (this.roles.length === 1) {
            this.selectedRoleId = this.roles[0].id;
            this.persistRoleAndContinue(this.roles[0]);
          } else {
            this.stage = 'role';
          }
        } else {
          this.router.navigate(['/users']);
        }
      })
      .catch(() => this.router.navigate(['/users']));
  }
}
