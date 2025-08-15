import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutoringService, Tutoring, CreateTutoringDto } from './services/tutoring.service';

@Component({
  selector: 'app-tutoring-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section style="display:grid; gap:12px; max-width:720px; margin: 16px auto;">
      <h2>Tutorías - Ejemplo de Consumo de API</h2>

      <div style="display:grid; gap:8px; padding:12px; border:1px solid #ddd; border-radius:8px;">
        <label>
          Estudiante ID
          <input type="number" [(ngModel)]="form.student_id" />
        </label>
        <label>
          Profesor ID
          <input type="number" [(ngModel)]="form.teacher_id" />
        </label>
        <label>
          Fecha (ISO)
          <input type="text" [(ngModel)]="form.date" placeholder="2025-08-13T12:00:00.000Z" />
        </label>
        <label>
          Tema
          <input type="text" [(ngModel)]="form.topic" />
        </label>
        <label>
          Notas
          <textarea [(ngModel)]="form.notes"></textarea>
        </label>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button (click)="create()">Crear</button>
          <button (click)="load()">Listar</button>
          <button (click)="update()" [disabled]="!selectedId">Actualizar (id={{selectedId||'-'}})</button>
          <button (click)="remove()" [disabled]="!selectedId">Eliminar (id={{selectedId||'-'}})</button>
          <button (click)="report()" [disabled]="!form.student_id">Reporte Semanal</button>
        </div>
        <div *ngIf="message" style="color:#2e7d32;">{{message}}</div>
        <div *ngIf="error" style="color:#c62828;">{{error}}</div>
      </div>

      <div style="display:grid; gap:8px;">
        <h3>Listado</h3>
        <div *ngFor="let t of listData" (click)="selectedId = t.id" [style.cursor]="'pointer'" [style.background]="selectedId===t.id ? '#f0f0f0' : 'transparent'" style="padding:8px; border:1px solid #eee; border-radius:6px;">
          <pre style="margin:0; white-space:pre-wrap">{{ t | json }}</pre>
        </div>
      </div>
    </section>
  `,
})
export class TutoringExampleComponent {
  private tutoring = inject(TutoringService);

  form: CreateTutoringDto = {
    student_id: 0,
    teacher_id: 0,
    date: '',
    topic: '',
    notes: ''
  };

  listData: Tutoring[] = [];
  selectedId?: number;
  message = '';
  error = '';

  clearMessages() {
    this.message = '';
    this.error = '';
  }

  create() {
    this.clearMessages();
    this.tutoring.create(this.form).subscribe({
      next: (res) => {
        this.message = 'Tutoría creada correctamente';
        this.load();
      },
      error: (err: Error) => this.error = err.message,
    });
  }

  load() {
    this.clearMessages();
    this.tutoring.list().subscribe({
      next: (res) => this.listData = res,
      error: (err: Error) => this.error = err.message,
    });
  }

  update() {
    if (!this.selectedId) return;
    this.clearMessages();
    const payload: Partial<CreateTutoringDto> = {
      topic: this.form.topic,
      notes: this.form.notes,
      date: this.form.date,
      teacher_id: this.form.teacher_id,
      student_id: this.form.student_id,
    };
    this.tutoring.update(this.selectedId, payload).subscribe({
      next: (res) => this.message = 'Tutoría actualizada',
      error: (err: Error) => this.error = err.message,
    });
  }

  remove() {
    if (!this.selectedId) return;
    this.clearMessages();
    this.tutoring.remove(this.selectedId).subscribe({
      next: () => {
        this.message = 'Tutoría eliminada';
        this.load();
      },
      error: (err: Error) => this.error = err.message,
    });
  }

  report() {
    if (!this.form.student_id) return;
    this.clearMessages();
    this.tutoring.weeklyReport(this.form.student_id).subscribe({
      next: (res) => {
        this.message = 'Reporte obtenido';
        console.log('Reporte semanal:', res);
      },
      error: (err: Error) => this.error = err.message,
    });
  }
}
