
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menuOpen = false;
  userEmail = localStorage.getItem('userEmail') || '';

  constructor(private router: Router) {}

  get userInitial(): string {
    const email = this.userEmail || 'U';
    return email.charAt(0).toUpperCase();
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  goProfile() {
    const id = localStorage.getItem('userId');
    if (id) this.router.navigate(['/profile', id]);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedRoleName');
    this.router.navigate(['/login']);
  }
}
