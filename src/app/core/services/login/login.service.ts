import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// URL de la api
import { environment } from '../../../../environments/environment.development';
@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private apiURL = environment.API_URL;
    private loginUrl: string;

    constructor(private http: HttpClient) {
        this.loginUrl = "auth/";
    }

    login(registerForm: any): Observable<any> {
        return this.http.post<any>(`${this.apiURL}${this.loginUrl}`, registerForm);
    }
}
