import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';

@Injectable({
	providedIn: 'root'
})
export class TokenService {
	private apiURL = environment.API_URL;
	private refreshUrl: string;
	private readonly ACCESS_TOKEN_KEY = 'authToken';
	private readonly REFRESH_TOKEN = 'refreshToken';

	constructor(private http: HttpClient) { 
		this.refreshUrl = "auth/refresh"
	}

	saveTokens(accessToken: string, refreshToken: string): void {
		localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
		localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
	}

	removeTokens(): void {
		localStorage.removeItem(this.ACCESS_TOKEN_KEY);
		localStorage.removeItem(this.REFRESH_TOKEN);
	}

	getAuthToken() {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY) || '';
    }

    getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN) || '';
    }

	refreshToken() {
		const refreshToken = this.getRefreshToken();
		const body = { refreshToken: refreshToken };

		return this.http.post<any>(`${environment.API_URL}${this.refreshUrl}`, body);
	}

	getUserIdFromToken(): string | null {
		const token = this.getAuthToken();
		if (token) {
			const decodedToken: any = jwtDecode(token);
			return decodedToken.userId || null;
		}
		return null;
	}
}
