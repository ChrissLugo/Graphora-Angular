import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // Importa NgForm
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule], // Añade CommonModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm; // Referencia al formulario

  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  errorMessage = '';
  isLoading = false;

  private http = inject(HttpClient);
  private router = inject(Router);

  onSubmit() {
    if (!this.loginForm.valid) {
      this.errorMessage = 'Por favor completa todos los campos';
      return; // Detiene la ejecución si el formulario no es válido
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>('URL_DE_TU_BACKEND/login', this.credentials)
      .subscribe({
        next: (response) => {
          // Guardar token si es necesario
          if (this.credentials.rememberMe) {
            localStorage.setItem('authToken', response.token);
          } else {
            sessionStorage.setItem('authToken', response.token);
          }
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Error en el login';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}