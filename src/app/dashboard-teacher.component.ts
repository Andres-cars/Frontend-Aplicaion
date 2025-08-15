import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-teacher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding:16px">
      <h2>Dashboard Docente</h2>
      <p>Más permisos: gestionar tutorías, ver usuarios asignados, reportes avanzados, etc.</p>
    </section>
  `,
})
export class DashboardTeacherComponent {}
