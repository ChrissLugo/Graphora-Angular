// recycling-bin.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDiagramsService } from '../../core/services/API/user/UserDiagrams.service';
import { catchError, of } from 'rxjs';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-recycling-bin',
	standalone: true,
	imports: [CommonModule, FontAwesomeModule],
	templateUrl: './recycling-bin.component.html',
	styleUrl: './recycling-bin.component.css',
})
export default class RecyclingBinComponent {
	private diagramsSvc = inject(UserDiagramsService);

	constructor(library: FaIconLibrary) {
		library.addIcons(faArrowRotateLeft, faTrash);
	}

	recycledDiagrams$ = this.diagramsSvc.getRecyclingBin().pipe(
		catchError((err) => {
			console.error('Error cargando papelera', err);
			return of([]); // Retorna un array vacío si falla
		})
	);

	async restoreDiagram(id: number) {
		const result = await Swal.fire({
			title: '¿Restaurar diagrama?',
			text: '¿Estás seguro de que quieres restaurar este diagrama?',
			icon: 'question',
			theme: 'dark',
			showCancelButton: true,
			cancelButtonColor: "#E92718",
			confirmButtonColor: "#8200DB",
			confirmButtonText: 'Sí, restaurar',
			cancelButtonText: 'Cancelar',
			reverseButtons: true,
		});

		if (result.isConfirmed) {
			this.diagramsSvc.restoreDiagram(id).subscribe({
				next: () => {
					this.recycledDiagrams$ = this.diagramsSvc.getRecyclingBin();
					Swal.fire('¡Restaurado!', 'El diagrama ha sido restaurado.', 'success');
				},
				error: (err) => {
					console.error('Error restaurando diagrama', err);
					Swal.fire('Error', 'No se pudo restaurar el diagrama.', 'error');
				},
			});
		}
	}

	async deleteDiagramPermanently(id: number) {
		const result = await Swal.fire({
			title: '¿Eliminar definitivamente?',
			text: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
			icon: 'warning',
			theme: 'dark',
			showCancelButton: true,
			cancelButtonColor: "#E92718",
			confirmButtonColor: "#8200DB",
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar',
			reverseButtons: true,
		});

		if (result.isConfirmed) {
			this.diagramsSvc.deleteDiagramPermanently(id).subscribe({
				next: () => {
					this.recycledDiagrams$ = this.diagramsSvc.getRecyclingBin();
					Swal.fire('¡Eliminado!', 'El diagrama ha sido eliminado permanentemente.', 'success');
				},
				error: (err) => {
					console.error('Error eliminando diagrama', err);
					Swal.fire('Error', 'No se pudo eliminar el diagrama.', 'error');
				},
			});
		}
	}
}
