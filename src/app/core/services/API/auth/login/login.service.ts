import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// URL de la api
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { TokenService } from '../token/token.service';
@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private apiURL = environment.apiUrl;
	private loginUrl = '/auth';

	constructor(
		private http: HttpClient,
		private router: Router,
		private _tokenService: TokenService
	) {}

	login(registerForm: any): Observable<any> {
		return this.http.post<any>(
			`${this.apiURL}${this.loginUrl}`,
			registerForm
		);

		// return this.http.post(`${this.apiURL}${this.loginUrl}`, registerForm).pipe(
		//     tap((response) => {
		//         this._tokenService.saveTokens(response.accessToken, response.refreshToken); // 👈 Almacena los datos
		//     })
		// );
	}

	logout(): void {
		localStorage.removeItem('authToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('currentDiagram');

		this.router.navigate(['/login']);
	}
}
