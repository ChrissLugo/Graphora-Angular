import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'start',
    loadComponent: () => import('./business/start/start.component'),
  },
  //   {
  //     path: '',
  //     loadComponent: () => import('./shared/components/layout/layout.component'),
  //     children: [
  //       {
  //         path: 'home',
  //         loadComponent: () => import('./business/home/home.component'),
  //         canActivate: [authGuard],
  //       },
  //     ],
  //   },
  {
    path: 'login',
    loadComponent: () => import('./business/auth/login/login.component'),
    // canActivate: [AuthenticatedGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./business/auth/register/register.component'),
    //canActivate: [AuthenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
