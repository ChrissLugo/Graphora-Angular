import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/API/auth/token/token.service';

export const authGuard: CanActivateFn = (route, state) => {
	const authService = inject(TokenService);
	const router = inject(Router);

	if (authService.isAuthenticated()) {
		return true;
	} else {
		return router.navigate(['/login']);
	}
};
