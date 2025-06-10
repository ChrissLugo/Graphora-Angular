import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserDiagramsService } from '../../core/services/API/user/UserDiagrams.service';
import { DiagramsTransferService } from '../../core/services/Data Transfer/DiagramsTransfer.service';
import { SwalMessageService } from '../../core/services/messages/swal-message.service';
import Swal from 'sweetalert2';
import { faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule], // <--- aquí
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export default class DocumentsComponent implements OnInit {
  diagrams: any[] = [];
  loading = true;
  error = '';

  constructor(
    private userDiagramsService: UserDiagramsService,
    private diagramTransferSrv: DiagramsTransferService,
    private router: Router,
    private messageService: SwalMessageService,
    private faLibrary: FaIconLibrary // <--- agrega esto
  ) {
    this.faLibrary.addIcons(faTrash, faStar); // <--- registra los iconos
  }

  ngOnInit() {
    this.userDiagramsService.getDiagrams().subscribe({
      next: (data: any) => {
        this.diagrams = data.diagrams || data;
        console.log('Diagrams:', this.diagrams); // <-- Agrega esto
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los diagramas';
        this.loading = false;
      }
    });
  }

  openDiagram(id: number) {
    this.messageService.loadMessage();
    this.userDiagramsService.getDiagramById(id).subscribe({
      next: (data: any) => {
        this.userDiagramsService.currentDiagram = data.diagram;
        this.diagramTransferSrv.setType('user');
        this.diagramTransferSrv.changeJSON(this.userDiagramsService.currentDiagram);
        Swal.close();
        this.router.navigate(['/diagram']);
      },
      error: (err: any) => console.error(err),
    });
  }

  sendToRecyclingBin(id: number) {
    Swal.fire({
      title: '¿Seguro que desea enviar este diagrama a la papelera?',
      text: 'Luego podrá restaurarlo si así lo desea.',
      icon: 'info',
      theme: 'dark',
      showCancelButton: true,
      confirmButtonColor: '#8200DB',
      cancelButtonColor: '#E92718',
      confirmButtonText: 'Enviar a la papelera',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userDiagramsService.sendToRecyclingBin(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Listo!',
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000,
              theme: 'dark',
              text: 'Puede ver el diagrama en la papelera',
              icon: 'success',
            });
            // Opcional: recargar lista
            this.ngOnInit();
          },
          error: (err) => {
            Swal.fire({
              theme: 'dark',
              title: 'Error al enviar a la papelera',
              text: err,
              icon: 'error',
            });
          },
        });
      }
    });
  }

  addToFavorites(diagramId: number, isFavorite: boolean) {
    this.userDiagramsService.favoriteDiagram(diagramId, isFavorite).subscribe({
      next: () => {
        // Actualiza el array local para reflejar el cambio en la UI
        const diagram = this.diagrams.find(
          (d) => d.template_id === diagramId
        );
        if (diagram) diagram.is_favorite = isFavorite;

        Swal.fire({
          title: 'Favoritos',
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          text: isFavorite
            ? '¡Diagrama agregado a favoritos!'
            : '¡Diagrama removido de favoritos!',
          icon: 'success',
          theme: 'dark',
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el favorito.',
          icon: 'error',
          theme: 'dark',
        });
        console.error(err);
      },
    });
  }
}
