import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      //este es el guard para verificar acceso de usuario autorizado
      //en este caso, si el usuario esta autenticado, no puede volver a estas rutas
      NotAuthenticatedGuard,
    ],
  },
  { path: '', loadChildren: () => import('./store-front/store-front.routes') },
];
