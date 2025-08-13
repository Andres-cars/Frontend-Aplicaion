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

  register() {
    const payload = {
      user: this.user,
      email: this.email,
      password: this.password
    };

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
