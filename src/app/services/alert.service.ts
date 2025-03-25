import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private baseStyles = {
    popup: 'rounded-lg shadow-lg bg-black border border-purple-500 text-purple-300',
    title: 'font-bold text-lg text-purple-300',
    confirmButton:
      'px-4 py-2 rounded-md font-medium text-purple-300 border border-purple-500 hover:bg-purple-500 hover:text-white',
    cancelButton:
      'px-4 py-2 rounded-md font-medium text-purple-300 border border-purple-500 hover:bg-purple-500 hover:text-white',
  };
// PRUEBA DE COMMIT NUEVO
  constructor() {}

  success(mensaje: string, titulo: string = 'Exito') {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        popup: this.baseStyles.popup,
        title: this.baseStyles.title,
        confirmButton: this.baseStyles.confirmButton,
      },
    });
  }

  error(mensaje: string, titulo: string = 'Error') {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        popup: this.baseStyles.popup,
        title: this.baseStyles.title,
        confirmButton: this.baseStyles.confirmButton,
      },
    });
  }

  confirm(mensaje: string, titulo: string = 'Confirmación', callback: () => void) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: this.baseStyles.popup,
        title: this.baseStyles.title,
        confirmButton: this.baseStyles.confirmButton,
        cancelButton: this.baseStyles.cancelButton,
      },
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        callback();
      }
    });
  }
}
