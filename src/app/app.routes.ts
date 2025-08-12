import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { PersonProfileComponent } from './person-profile.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserComponent, canActivate: [authGuard] },
  { path: 'profile/:userId', component: PersonProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
