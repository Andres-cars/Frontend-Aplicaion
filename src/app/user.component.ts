import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  loading = true;
  error = '';

  currentUserId: number | null = null;
  currentEmail: string = '';
  currentRole: string | null = null;

  person: any = null; // { id, ci, name, lastname, address, phone, photo }

  get fullName() {
    const name = this.person?.name || '';
    const lastname = this.person?.lastname || '';
    return `${name} ${lastname}`.trim();
  }

  get photoUrl(): string | null {
    const file = this.person?.photo || null;
    if (!file) return null;
    // Ajusta el path base según cómo sirves las imágenes en backend
    return `http://localhost:3000/public/imagenes/personas/${file}`;
  }

  ngOnInit() {
    const id = localStorage.getItem('userId');
    this.currentUserId = id ? Number(id) : null;
    this.currentEmail = localStorage.getItem('userEmail') || '';
    this.currentRole = localStorage.getItem('selectedRoleName');

    if (!this.currentUserId) {
      // Intentar resolución por email si no hay userId en localStorage
      if (this.currentEmail) {
        this.userService.getUsers().subscribe({
          next: (res) => {
            const list = res?.users || res || [];
            const found = Array.isArray(list)
              ? list.find((u: any) => (u?.email || '').toLowerCase() === this.currentEmail.toLowerCase())
              : null;
            if (found?.id) {
              this.currentUserId = Number(found.id);
              this.loadById(this.currentUserId);
            } else {
              this.loading = false;
              this.error = 'No se encontró el usuario en sesión';
            }
          },
          error: () => {
            this.loading = false;
            this.error = 'No se encontró el usuario en sesión';
          }
        });
      } else {
        this.loading = false;
        this.error = 'No se encontró el usuario en sesión';
      }
      return;
    }

    this.loadById(this.currentUserId);
  }

  private loadById(id: number) {
    this.userService.getUser(id).subscribe({
      next: (res) => {
        const user = res?.user || res;
        const person = user?.person || user?.persons || null;
        this.person = person;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el perfil del usuario';
        this.loading = false;
      }
    });
  }

  goToEdit() {
    if (this.currentUserId) {
      this.router.navigate(['profile', this.currentUserId]);
    }
  }
}
