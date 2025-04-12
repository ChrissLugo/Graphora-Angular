import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token/token.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const tokenService = inject(TokenService);

	const authToken = tokenService.getAuthToken();

	const authReq = req.clone({
		setHeaders: {
			Authorization: authToken,

		}
	})

	return next(authReq).pipe(
		catchError((error) => {
			return tokenService.refreshToken().pipe(
				switchMap((res) => {
					// Guarda el nuevo token en el servicio
					localStorage.setItem('authToken', res.accessToken);

					const newReq = req.clone({
						setHeaders: {
							Authorization: res.accessToken,
						}
					});

					return next(newReq);
				}),
				catchError((refreshError) => {
					const finalError = new Error(refreshError);

					tokenService.removeTokens(); // Elimina los tokens de localStorage
					// Aquí puedes redirigir al usuario a la página de login o mostrar un mensaje
					// this.router.navigate(['/login']);

					return throwError(() => finalError)
				})
			)
		})
	);
};
