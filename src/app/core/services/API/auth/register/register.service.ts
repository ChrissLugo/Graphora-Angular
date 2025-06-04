import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// URL de la API
import { environment } from '../../../../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class RegisterService {
	private apiURL = environment.apiUrl;
	private registerUrl: string;

	constructor(private http: HttpClient) {
		this.registerUrl = '/users';
	}

	register(userData: any): Observable<any> {
		return this.http.post<any>(
			`${this.apiURL}${this.registerUrl}`,
			userData
		);
	}
}
