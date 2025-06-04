import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
	providedIn: 'root'
})
export class UserStateService {
	private userDataSubject = new BehaviorSubject<User | null>(null);
	userData$ = this.userDataSubject.asObservable();

	constructor() { }

	get currentUserValue(): any {
		return this.userDataSubject.value;
	}
	
	setUserData(data: any): void {
		this.userDataSubject.next(data);
	}

	clearUserData(): void {
		this.userDataSubject.next(null);
	}
}
