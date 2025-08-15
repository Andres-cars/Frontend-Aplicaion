import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private auth = inject(AuthService);

  user = '';
  email = '';
  password = '';
  error = '';
  success = '';
  roles: string[] = ['estudiante', 'docente'];
  selectedRole: string = 'estudiante';
  // Ajusta estos IDs a los que tengas en tu tabla typeusers
  roleMap: Record<string, number> = {
    'estudiante': 1,
    'docente': 2,
  };

  register() {
    const typeId = this.roleMap[this.selectedRole?.toLowerCase() as 'estudiante' | 'docente'];
    if (!typeId) {
      this.error = 'Rol inválido. Verifica la configuración de roles.';
      this.success = '';
      return;
    }

    const payload = {
      user: this.user?.trim(),
      email: this.email?.trim(),
      password: this.password,
      typeusers_id: typeId,
    };
    console.log('Register payload', payload);

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.success = 'Registro exitoso';
        this.error = '';
      },
      error: (err) => {
        const serverMessage = err?.error?.message || err?.message || '';
        this.error = `Error de registro${serverMessage ? ': ' + serverMessage : ''}`;
        this.success = '';
        console.error('Register error:', err);
      }
    });
  }
}
