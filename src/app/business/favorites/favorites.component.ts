import { Component, OnInit } from '@angular/core';
import { UserDiagramsService } from '../../core/services/API/user/UserDiagrams.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SwalMessageService } from '../../core/services/messages/swal-message.service';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export default class FavoritesComponent implements OnInit {
  favoriteDiagrams: any[] = [];

  constructor(
    private userDiagramsSrv: UserDiagramsService,
    private router: Router,
    private messageService: SwalMessageService
  ) {}

  ngOnInit(): void {
    this.userDiagramsSrv.getFavoriteDiagrams().subscribe({
      next: (data: any) => {
        this.favoriteDiagrams = Array.isArray(data?.data) ? data.data : [];
      },
      error: (err) => {
        console.error(err);
        this.favoriteDiagrams = [];
      }
    });
  }

  removeFromFavorites(diagramId: number) {
    this.userDiagramsSrv.favoriteDiagram(diagramId, false).subscribe({
      next: () => {
        this.favoriteDiagrams = this.favoriteDiagrams.filter(d => d.template_id !== diagramId);
      },
      error: (err) => {
        // Si el error es 404, igual elimina del array local
        if (err.status === 404) {
          this.favoriteDiagrams = this.favoriteDiagrams.filter(d => d.template_id !== diagramId);
        }
        console.error(err);
      }
    });
  }

  sendDiagramJSON(id: number) {
    this.messageService.loadMessage();
    this.userDiagramsSrv.getDiagramById(id).subscribe({
      next: (data: any) => {
        this.userDiagramsSrv.currentDiagram = data.diagram;
        // Si tienes un DiagramsTransferService, puedes usarlo aquí si es necesario
        // this.DiagramTransferSrv.setType('user');
        // this.DiagramTransferSrv.changeJSON(this.userDiagramsSrv.currentDiagram);
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
        // Primero quitar de favoritos
        this.userDiagramsSrv.favoriteDiagram(id, false).subscribe({
          next: () => {
            // Luego enviarlo a la papelera
            this.userDiagramsSrv.sendToRecyclingBin(id).subscribe({
              next: () => {
                // Elimina localmente de favoritos
                this.favoriteDiagrams = this.favoriteDiagrams.filter(d => d.template_id !== id);
                Swal.fire({
                  title: 'Listo!',
                  theme: 'dark',
                  text: 'Puede ver el diagrama en la papelera',
                  icon: 'success',
                });
              },
              error: (err) => {
                // Si el error es 404, igual elimina localmente
                this.favoriteDiagrams = this.favoriteDiagrams.filter(d => d.template_id !== id);
                Swal.fire({
                  theme: 'dark',
                  title: 'Error al enviar a la papelera',
                  text: err,
                  icon: 'error',
                });
              }
            });
          },
          error: (err) => {
            // Si el error es 404, igual elimina localmente
            this.favoriteDiagrams = this.favoriteDiagrams.filter(d => d.template_id !== id);
            Swal.fire({
              theme: 'dark',
              title: 'Error al quitar de favoritos',
              text: err,
              icon: 'error',
            });
          }
        });
      }
    });
  }
}
