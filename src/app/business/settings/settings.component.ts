import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  imports: [FormsModule,CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export default class SettingsComponent {
  user = {
    name: '',      // Cambia firstName por name
    lastName: '',
    email: '',
    password: ''
  };
  message = '';
  error = '';

  constructor(private http: HttpClient) {}

  updateUser() {
    this.message = '';
    this.error = '';

    const payload: any = {};
    if (this.user.name && this.user.name.trim() !== '') payload.name = this.user.name.trim();
    if (this.user.lastName && this.user.lastName.trim() !== '') payload.lastName = this.user.lastName.trim();
    if (this.user.email && this.user.email.trim() !== '') payload.email = this.user.email.trim();
    if (this.user.password && this.user.password.trim() !== '') payload.password = this.user.password;

    if (Object.keys(payload).length === 0) {
      this.error = 'Debes ingresar al menos un dato para actualizar.';
      return;
    }

    this.http.patch('https://api-graphora.up.railway.app/users', payload)
      .subscribe({
        next: () => {
          this.message = 'Datos actualizados correctamente';
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Datos actualizados correctamente',
            theme: 'dark',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error: (err) => {
          this.error = 'Error al actualizar: ' + (err.error?.message || 'Intenta de nuevo');
        }
      });
  }

}

