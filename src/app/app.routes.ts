import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

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
	{
		path: '',
		loadComponent: () =>
			import('./shared/components/layout/layout.component'),
		children: [
			{
				path: 'home',
				loadComponent: () => import('./business/home/home.component'),
				canActivate: [authGuard],
			},
			{
				path: 'documents',
				loadComponent: () =>
					import('./business/documents/documents.component'),
				canActivate: [authGuard],
			},
			{
				path: 'favorites',
				loadComponent: () =>
					import('./business/favorites/favorites.component'),
				canActivate: [authGuard],
			},
			{
				path: 'shared',
				loadComponent: () =>
					import('./business/shared/shared.component'),
				canActivate: [authGuard],
			},
			{
				path: 'notifications',
				loadComponent: () =>
					import('./business/notifications/notifications.component'),
				canActivate: [authGuard],
			},
			{
				path: 'settings',
				loadComponent: () =>
					import('./business/settings/settings.component'),
				canActivate: [authGuard],
			},
		],
	},
	{
		path: 'diagram/:id',
		loadComponent: () =>
			import('./shared/components/my-diagram/my-diagram.component'),
		canActivate: [authGuard],
	},
	{
		path: 'login',
		loadComponent: () => import('./business/auth/login/login.component'),
		canActivate: [AuthenticatedGuard],
	},
	{
		path: 'register',
		loadComponent: () =>
			import('./business/auth/register/register.component'),
		canActivate: [AuthenticatedGuard],
	},
	{
		path: '**',
		redirectTo: 'home',
	},
];
