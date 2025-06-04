import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/API/auth/token/token.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const tokenService = inject(TokenService);

	const authToken = tokenService.getAuthToken();
	const refreshToken = tokenService.getRefreshToken();

	const authReq = req.clone({
		setHeaders: {
			Authorization: `Bearer ${authToken}`,
		},
	});

	return next(authReq).pipe(
		catchError((error) => {
			if (error.status === 401) {
				return tokenService.refreshToken().pipe(
					switchMap((res) => {
						// Guarda el nuevo token en el servicio
						localStorage.setItem('authToken', res.accessToken);
						localStorage.setItem('refreshToken', res.refreshToken);

						const newReq = req.clone({
							setHeaders: {
								Authorization: `Bearer ${res.accessToken}`,
							},
						});

						return next(newReq);
					}),
					catchError((refreshError) => {
						tokenService.removeTokens();
						window.location.href = '/login'; // Redirige forzosamente
						return throwError(() => refreshError);
					})
				);
			}

			return throwError(() => error);
		})
	);
};
