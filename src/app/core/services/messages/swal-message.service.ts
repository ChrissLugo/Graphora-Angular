import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SwalMessageService {

    constructor() { }
    
    loadMessage() {
        Swal.fire({
            toast: true,
            position: "top-end",
            title: "Cargando...",
            showConfirmButton: false,
            background: "#fff linear-gradient(145deg, rgba(255, 255, 255, 1) 30%, rgba(0, 136, 204, 1) 100%)",
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }
    
    messageIcon(message: string, icon: "success" | "error" | "warning" | "info" | "question"): Promise<void> {
        return Swal.fire({
            position: "top-end",
            icon: icon,
            title: "<h3>" + message + "</h3>",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2200
        }).then(() => {});
    }

    messageError(message: string) {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "<h3>" + message + "</h3>",
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2000
        });
    }

    errorResponse(e: HttpErrorResponse) {
        if(e.error.message) {
            this.messageError(e.error.message);
        } else {
            this.messageError("Upps ocurrió un error");
        }
    }
}
