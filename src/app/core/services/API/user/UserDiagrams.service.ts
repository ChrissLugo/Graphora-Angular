import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';

@Injectable({
	providedIn: 'root',
})
export class UserDiagramsService {
	readonly API_URL = environment.apiUrl;
	allDiagrams: any;
	currentDiagram: any;

	constructor(private http: HttpClient) {
		this.allDiagrams = [];
		this.currentDiagram = [];
	}

	getDiagrams() {
		return this.http.get<any[]>(`${this.API_URL}/diagram/templates`); // Cambiar url
	}

	getDiagramById(id: number) {
		return this.http.get<any[]>(`${this.API_URL}/diagram/templates/${id}`); // Cambiar url
	}

	updateDiagram() {}
}
