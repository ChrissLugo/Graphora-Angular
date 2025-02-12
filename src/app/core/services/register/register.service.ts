import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// URL de la API
import { environment } from '../../../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class RegisterService {
	private apiURL = environment.API_URL;
	private registerUrl: string;

	constructor(private http: HttpClient) {
		this.registerUrl = ''; // Asegúrate de definir la ruta correcta
	}

	register(userData: any): Observable<any> {
		return this.http
			.post<any>(`${this.apiURL}${this.registerUrl}`, userData)
			.pipe(
				tap((res) => {
					console.log(res);
				})
			);
	}
}
