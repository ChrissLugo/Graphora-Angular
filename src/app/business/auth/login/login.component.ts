import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Importa NgForm
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf

// Servicios
import { AuthService } from '../../../core/services/auth/auth.service';
import { SwalMessageService } from '../../../core/services/messages/swal-message.service';
import Swal from 'sweetalert2';
import { TokenService } from '../../../core/services/token/token.service';
import { UserStateService } from '../../../core/services/user-state/user-state.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule], // Añade CommonModule
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export default class LoginComponent {
    @ViewChild('loginForm') loginForm!: NgForm; // Referencia al formulario

    credentials = {
        email: '',
        password: '',
    };

    errorMessage = '';
    isLoading = false;

    constructor(
        private router: Router,
        private _authService: AuthService,
        private _messageService: SwalMessageService,
        private _tokenService: TokenService,
        private _userStateService: UserStateService
    ) { }

    onSubmit() {
        if (!this.loginForm.valid) {
            this._messageService.messageIcon("Por favor, completa todos los campos", "error");
            return;
        }

        this.isLoading = true;
        this._messageService.loadMessage();

        this._authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                // Guarda los tokens en el servicio
                this._tokenService.saveTokens(response.accessToken, response.refreshToken);
                this._userStateService.setUserData(response.user); // <- Guarda los datos del usuario en el servicio
                Swal.close();
                this.router.navigate(['/home']);
            },
            error: (e: HttpErrorResponse) => {
                this.isLoading = false; // <- Asegurar que se desactive la carga en errores
                this._messageService.errorResponse(e);
            }
        });
    }
}