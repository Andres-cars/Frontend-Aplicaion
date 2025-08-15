import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutoringService, Tutoring } from './services/tutoring.service';

@Component({
  selector: 'app-tutoring-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="display:grid; gap:12px; max-width:900px; margin:16px auto;">
      <h2>Listado de Tutorías</h2>
      <div style="display:flex; gap:8px; align-items:center;">
        <button (click)="load()">Actualizar</button>
      </div>
      <div *ngIf="error" style="color:#c62828;">{{error}}</div>
      <div *ngIf="!listData.length && !error">No hay tutorías para mostrar.</div>
      <div style="display:grid; gap:8px;">
        <div *ngFor="let t of listData" style="padding:8px; border:1px solid #eee; border-radius:6px;">
          <pre style="margin:0; white-space:pre-wrap">{{ t | json }}</pre>
        </div>
      </div>
    </section>
  `,
})
export class TutoringListComponent {
  private tutoring = inject(TutoringService);
  listData: Tutoring[] = [];
  error = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.error = '';
    this.tutoring.list().subscribe({
      next: (res) => this.listData = res,
      error: (err: Error) => this.error = err.message,
    });
  }
}
