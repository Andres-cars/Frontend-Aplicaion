import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Component({
  selector: 'app-person-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.css']
})
export class PersonProfileComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private userService = inject(UserService);

  apiUrl = 'http://localhost:3000/api';

  userId: number | null = null;
  personId: number | null = null;

  ci = '';
  name = '';
  lastname = '';
  address = '';
  phone: string | number | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  loading = true;
  error = '';
  success = '';

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('userId') || this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? Number(idParam) : null;
    if (!this.userId) {
      this.loading = false;
      this.error = 'Falta el parámetro userId en la URL';
      return;
    }

    this.userService.getUser(this.userId).subscribe({
      next: (res) => {
        const user = res?.user;
        const person = user?.person || user?.persons || null;
        this.personId = user?.person_id || person?.id || null;
        if (person) {
          this.ci = person.ci ?? '';
          this.name = person.name ?? '';
          this.lastname = person.lastname ?? '';
          this.address = person.address ?? '';
          this.phone = person.phone ?? '';
          // Si backend guarda photo, se podría inicializar previewUrl aquí
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo cargar el usuario';
        this.loading = false;
      }
    });
  }

  save() {
    if (!this.personId) {
      this.error = 'No se pudo determinar el ID de la persona';
      return;
    }
    const payload: any = {
      name: this.name,
      lastname: this.lastname,
      ci: this.ci,
      address: this.address,
      phone: this.phone,
    };

    this.http.put(`${this.apiUrl}/person/${this.personId}`, payload).subscribe({
      next: () => {
        this.success = 'Perfil actualizado';
        this.error = '';
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al actualizar el perfil';
        this.success = '';
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImage() {
    if (!this.personId || !this.selectedFile) return;
    const form = new FormData();
    form.append('file', this.selectedFile);
    this.http.put(`${this.apiUrl}/update/image/${this.personId}`, form).subscribe({
      next: () => {
        this.success = 'Imagen actualizada';
        this.error = '';
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al actualizar la imagen';
        this.success = '';
      }
    });
  }
}
