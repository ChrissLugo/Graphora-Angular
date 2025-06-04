import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/API/auth/token/token.service';

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
	const authService = inject(TokenService);
	const router = inject(Router);

	if (authService.isAuthenticated()) {
		return router.navigate(['/home']);
	} else {
		return true;
	}
};
