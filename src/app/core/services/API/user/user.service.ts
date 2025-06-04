import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private apiURL = environment.apiUrl;
	private userUrl: string;

	constructor(private http: HttpClient) {
		this.userUrl = '/users';
	}

	getUserData(userId: string) {
		return this.http.get<any>(`${this.apiURL}${this.userUrl}${userId}`);
	}
}
