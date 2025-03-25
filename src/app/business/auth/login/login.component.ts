import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Importa NgForm
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf

// Servicios
import { LoginService } from '../../../core/services/login/login.service';
import { SwalMessageService } from '../../../services/swal-message.service';
import Swal from 'sweetalert2';

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
        private _messageService: SwalMessageService
    ) { }

    onSubmit() {
        if (!this.loginForm.valid) {
            this._messageService.messageIcon("Por favor, completa todos los campos", "error");
            return; // Detiene la ejecución si el formulario no es válido
        }

        this._messageService.loadMessage();

        this.isLoading = false;
        this.errorMessage = '';
        const formData = this.credentials;

        this._loginService.login(formData).subscribe({
            next: (response) => {
                localStorage.setItem('authToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                this.router.navigate(['/home']);

                Swal.close();
                // Por si se quiere mostrar un mensaje de exito, aunque no lo veo valido 
                // this._messageService.messageIcon(response.message, "success").then(() => {
                //     console.log(response);
                // });

            },
            error: (e: HttpErrorResponse) => {
                this._messageService.errorResponse(e);
            }
        });
        // this.http.post<any>('URL_DE_TU_BACKEND/login', this.credentials)
        //     .subscribe({
        //         next: (response) => {
        //             // Guardar token si es necesario
        //             if (this.credentials.rememberMe) {
        //                 localStorage.setItem('authToken', response.token);
        //             } else {
        //                 sessionStorage.setItem('authToken', response.token);
        //             }
        //             this.router.navigate(['/home']);
        //         },
        //         error: (err) => {
        //             this.errorMessage = err.error.message || 'Error en el login';
        //             this.isLoading = false;
        //         },
        //         complete: () => {
        //             this.isLoading = false;
        //         }
        //     });
    }
}