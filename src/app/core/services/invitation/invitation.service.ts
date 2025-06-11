import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment.prod';
import { TokenService } from '../API/auth/token/token.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvitationService {
    private socket: Socket;
    readonly API_URL = environment.apiUrl;
    private invitationSubject = new Subject<any>();

    constructor(
        private _tokenService: TokenService,
    ) {
        this.socket = io(this.API_URL, {
            transports: ['websocket'],
            autoConnect: true,
            auth: {
                email: localStorage.getItem('email_user')
            }
        });

        this.socket.on('connect', () => {
            console.log('🟢 Conectado al servidor Socket.IO:', this.socket.id);
        })

        this.socket.on('disconnect', () => {
            console.log('🔴 Desconectado del servidor Socket.IO');
        });

        this.socket.on('invitation', (data) => {
            console.log('📨 Notificación global recibida:', data);
            this.invitationSubject.next(data);
        });

    }

    sendNotification(InvitedUserEmail: string, diagramId: string) {
        const userId = this._tokenService.getUserIdFromToken();

        this.socket.emit('send-invitation', {
            InvitedUserEmail,
            diagramId,
            userId
        });
    }

    // Escuchar notificaciones recibidas
    onInvitation(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('invitation', (data) => {
                console.log("Nueva invitacion recibida: ", data);
                observer.next(data);
            });
        });
    }

    // Suscribirse globalmente
        onGlobalInvitation(): Observable<any> {
        return this.invitationSubject.asObservable();
    }

}
