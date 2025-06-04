import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DiagramsTransferService {
	private dataSource = new BehaviorSubject<any>(null);
	currentJson = this.dataSource.asObservable();

	constructor() {}

	changeJSON(data: any) {
		this.dataSource.next(data);
	}
}
