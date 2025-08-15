import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Guard que valida el rol del usuario contra los roles permitidos en la ruta
// Uso en rutas: data: { roles: ['student', 'estudiante'] }
export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const selected = (localStorage.getItem('selectedRoleName') || '').toLowerCase();
  const allowedRaw = (route.data?.['roles'] as string[] | undefined) || [];
  const allowed = allowedRaw.map(r => r.toLowerCase());

  // Si la ruta no define roles, permite el acceso
  if (!allowed.length) return true;

  if (allowed.includes(selected)) return true;

  // Redirige al dashboard según el rol detectado
  if (selected.includes('docente') || selected.includes('teacher')) {
    router.navigate(['/dashboard-teacher']);
  } else {
    router.navigate(['/dashboard-student']);
  }
  return false;
};
