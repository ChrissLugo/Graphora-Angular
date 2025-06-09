import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';

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
		return this.http.get<any[]>(`${this.API_URL}/diagram/templates`);
	}

	getTemplateById(id: number) {
		return this.http.get<any[]>(`${this.API_URL}/diagram/templates/${id}`);
	}

	updateTemplate(id: number, data: any) {
		return this.http.put(`${this.API_URL}/diagram/templates/${id}`, data);
	}
}
