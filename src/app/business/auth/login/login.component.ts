import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Importa NgForm
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf

// Servicios
import { LoginService } from '../../../core/services/login/login.service';
import { SwalMessageService } from '../../../services/swal-message.service';
import Swal from 'sweetalert2';
import { TokenService } from '../../../core/services/token/token.service';

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
        private _loginService: LoginService,
        private _messageService: SwalMessageService,
        private _tokenService: TokenService
    ) { }

    onSubmit() {
        if (!this.loginForm.valid) {
            this._messageService.messageIcon("Por favor, completa todos los campos", "error");
            return; // Detiene la ejecución si el formulario no es válido
        }

        this._messageService.loadMessage();

        this.isLoading = true;
        const formData = this.credentials;

        this._loginService.login(formData).subscribe({
            next: (response) => {
                // Guarda los tokens en el servicio
                this._tokenService.saveTokens(
                    response.accessToken, 
                    response.refreshToken
                );
                
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