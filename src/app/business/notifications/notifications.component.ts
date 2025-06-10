import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InvitationService } from '../../core/services/invitation/invitation.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-notifications',
    imports: [CommonModule],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.css',
})
export default class NotificationsComponent {
    notifications: any[] = [];

    constructor(
        private _invitationService: InvitationService
    ) { }

    ngOnInit(): void {
        this._invitationService.onInvitation().subscribe((data) => {
            this.notifications.push(data);
        })
    }

}
