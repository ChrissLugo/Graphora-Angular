import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';
import { Subject, Observable, EMPTY } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class UserDiagramsService {
	readonly API_URL = environment.apiUrl;
	allDiagrams: any[] = [];
	currentDiagram: any = [];

	private _updateDiagramSubject = new Subject<{ id: number; data: any }>();

	updateDiagram$: Observable<any> = this._updateDiagramSubject.pipe(
		debounceTime(3500),
		switchMap((payload) => {
			const { id, data } = payload;
			return this.http
				.put<any>(`${this.API_URL}/diagram/me/${id}`, data)
				.pipe(
					catchError((err) => {
						return EMPTY;
					})
				);
		})
	);

	constructor(private http: HttpClient) {}

	getDiagrams(): Observable<any[]> {
		return this.http.get<any[]>(`${this.API_URL}/diagram/me`);
	}

	getDiagramById(id: number): Observable<any> {
		return this.http.get<any>(`${this.API_URL}/diagram/me/${id}`);
	}

	saveDiagram(data: any): Observable<any> {
		return this.http.post<any>(`${this.API_URL}/diagram/me`, data);
	}

	updateDiagram(payload: { id: number; data: any }): void {
		this._updateDiagramSubject.next(payload);
	}
}
