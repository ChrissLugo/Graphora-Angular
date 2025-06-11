import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
	FaIconLibrary,
	FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
	faArrowRightFromBracket,
	faGear,
	faBell,
	faTrash,
	faUsers,
	faStar,
	faDiagramProject,
	faHouse,
} from '@fortawesome/free-solid-svg-icons';

// Servicios
import { UserService } from '../../../core/services/API/user/user.service';
import { TokenService } from '../../../core/services/API/auth/token/token.service';
import { AuthService } from '../../../core/services/API/auth/login/login.service';
import { SwalMessageService } from '../../../core/services/messages/swal-message.service';
import { UserStateService } from '../../../core/services/user-state/user-state.service';
import { Observable } from 'rxjs';
import { User } from '../../../core/interfaces/user';
import { InvitationService } from '../../../core/services/invitation/invitation.service';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [
		FormsModule,
		NgClass,
		CommonModule,
		RouterLink,
		FontAwesomeModule,
	],
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
	selectedFilter: string = '';
	notification!: boolean;
	userData$: Observable<User | null>;
	userData!: any;
	totalNotifications = 0;

	constructor(
		private router: Router,
		private _userService: UserService,
		private _tokenService: TokenService,
		private _authService: AuthService,
		private _messageService: SwalMessageService,
		private _userStateService: UserStateService,
		icons: FaIconLibrary,
		private _invitationService: InvitationService
	) {
		this.selectedFilter = this.router.url.replace(/\//g, '');
		this.userData$ = this._userStateService.userData$;
		icons.addIcons(
			faGear,
			faBell,
			faArrowRightFromBracket,
			faTrash,
			faBell,
			faUsers,
			faStar,
			faDiagramProject,
			faHouse
		);
	}

	ngOnInit(): void {
		// if (
		// 	this._tokenService.getAuthToken() &&
		// 	!this._userStateService.currentUserValue
		// ) {
		// 	this.loadUserData();
		// }
		this.loadUserData();
		this._invitationService.onGlobalInvitation().subscribe((noti) => {
			console.log("Notificación recibida desde cualquier lugar ", noti)
			this.totalNotifications++;
		})
	}

	private loadUserData(): void {
		const userId = this._tokenService.getUserIdFromToken();

		if (!userId) {
			this._messageService.messageIcon(
				'No se pudo obtener el ID del usuario',
				'error'
			);
			return;
		}

		this._userService.getUserData(userId).subscribe({
			next: (user) => {
				this.userData = user.user;
				this._userStateService.setUserData(user);
				localStorage.setItem('email_user', user.user.email)
			},
			error: (err: any) => console.log(err),
		});
	}

	selected(selected: string): void {
		this.selectedFilter = selected;
	}

	logout(): void {
		console.log('Logout clicked');
		this._authService.logout();
	}
}
