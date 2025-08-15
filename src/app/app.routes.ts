import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { PersonProfileComponent } from './person-profile.component';
import { authGuard } from './auth.guard';
import { roleGuard } from './role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserComponent, canActivate: [authGuard] },
  { path: 'profile/:userId', component: PersonProfileComponent, canActivate: [authGuard] },
  { path: 'tutoring-demo', loadComponent: () => import('./tutoring-example.component').then(m => m.TutoringExampleComponent), canActivate: [authGuard] },
  { path: 'dashboard-student', loadComponent: () => import('./dashboard-student.component').then(m => m.DashboardStudentComponent), canActivate: [authGuard, roleGuard], data: { roles: ['estudiante', 'student'] } },
  { path: 'tutorias', loadComponent: () => import('./tutoring-list.component').then(m => m.TutoringListComponent), canActivate: [authGuard, roleGuard], data: { roles: ['estudiante', 'student'] } },
  { path: 'dashboard-teacher', loadComponent: () => import('./dashboard-teacher.component').then(m => m.DashboardTeacherComponent), canActivate: [authGuard, roleGuard], data: { roles: ['docente', 'teacher'] } },
  { path: '**', redirectTo: 'login' },
];
