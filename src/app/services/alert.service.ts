import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private baseStyles = {
    popup: 'rounded-lg shadow-lg bg-purple-900 text-white',
    title: 'font-bold text-lg text-purple-300',
    confirmButton: 'px-4 py-2 rounded-md font-medium text-white',
  };

  constructor() {}

  success(message: string, title: string = 'Éxito') {
    Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        popup: this.baseStyles.popup,
        title: `${this.baseStyles.title} text-purple-400`,
        confirmButton: `bg-purple-500 hover:bg-purple-600 ${this.baseStyles.confirmButton}`,
      },
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        popup: this.baseStyles.popup,
        title: `${this.baseStyles.title} text-purple-400`,
        confirmButton: `bg-purple-700 hover:bg-purple-800 ${this.baseStyles.confirmButton}`,
      },
    });
  }

  confirm(message: string, title: string = 'Confirmación', callback: () => void) {
    Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: this.baseStyles.popup,
        title: this.baseStyles.title,
        confirmButton: `bg-purple-500 hover:bg-purple-600 ${this.baseStyles.confirmButton}`,
        cancelButton: `bg-purple-300 hover:bg-purple-400 ${this.baseStyles.confirmButton} text-black`,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }
}
