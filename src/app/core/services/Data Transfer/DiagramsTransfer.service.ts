import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DiagramsTransferService {
	private dataSource = new BehaviorSubject<any>(null);
	currentJson = this.dataSource.asObservable();
	private type!: 'user' | 'template';

	constructor() {}

	changeJSON(data: any) {
		this.dataSource.next(data);
	}

	public getType() {
		return this.type;
	}

	public setType(type: 'user' | 'template') {
		this.type = type;
	}
}
