import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section style="padding:16px">
      <h2>Dashboard Estudiante</h2>
      <p>Acceso a funcionalidades limitadas: ver tutorías, reportes propios, perfil, etc.</p>
    </section>
  `,
})
export class DashboardStudentComponent {}
