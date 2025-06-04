import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class TemplatesService {
	readonly API_URL = environment.apiUrl;
	allTemplates: any;
	template: any;

	constructor(private http: HttpClient) {
		this.allTemplates = [];
		this.template = [];
	}

	getTemplates() {
		return this.http.get<any[]>(`${this.API_URL}/templates`);
	}

	getTemplateById(id: number) {
		return this.http.get<any[]>(`${this.API_URL}/templates/${id}`);
	}
}
