import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Servicios
import { UserService } from '../../../core/services/users/user.service';
import { TokenService } from '../../../core/services/token/token.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SwalMessageService } from '../../../core/services/messages/swal-message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserStateService } from '../../../core/services/user-state/user-state.service';
import { Observable } from 'rxjs';
import { User } from '../../../core/interfaces/user';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [
		FormsModule, 
		NgClass, 
		CommonModule, 
		RouterLink
	],
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
})

export class SidebarComponent {
	selectedFilter: string = '';
	notification!: boolean;
	userData$: Observable<User | null>;

	constructor(
		private router: Router,
		private _userService: UserService,
		private _tokenService: TokenService,
		private _authService: AuthService,
		private _messageService: SwalMessageService,
		private _userStateService: UserStateService
	) {
		this.selectedFilter = this.router.url.replace(/\//g, '');
		this.userData$ = this._userStateService.userData$;
	}

	ngOnInit(): void {
		if(this._tokenService.getAuthToken() && !this._userStateService.currentUserValue) {
			this.loadUserData();
		}
	}

	private loadUserData(): void {
		const userId = this._tokenService.getUserIdFromToken();

		if(!userId) {
			this._messageService.messageIcon("No se pudo obtener el ID del usuario", 'error');
			return
		}

		this._userService.getUserData(userId).subscribe({
			next: (user) => this._userStateService.setUserData(user),
			error: () => {
				this._tokenService.removeTokens()
				this.router.navigate(['/auth/login']);
			} 
				
		})
	}

	selected(selected: string): void {
		this.selectedFilter = selected;
	}

	logout(): void {
		console.log('Logout clicked');
		this._authService.logout();
	}
}
