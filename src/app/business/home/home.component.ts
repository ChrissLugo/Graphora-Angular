import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
	FaIconLibrary,
	FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
	faArrowRotateLeft,
	faPlus,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { TemplatesService } from '../../core/services/API/Templates/Templates.Service';
import { DiagramsTransferService } from '../../core/services/Data Transfer/DiagramsTransfer.service';
import { SwalMessageService } from '../../core/services/messages/swal-message.service';
import Swal from 'sweetalert2';
import { UserDiagramsService } from '../../core/services/API/user/UserDiagrams.service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-home',
	imports: [RouterModule, FontAwesomeModule, CommonModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
	constructor(
		public TemplatesService: TemplatesService,
		public UserDiagramsSrv: UserDiagramsService,
		public DiagramTransferSrv: DiagramsTransferService,
		private router: Router,
		public messageService: SwalMessageService,
		icons: FaIconLibrary
	) {
		icons.addIcons(faArrowRotateLeft, faPlus, faTrash);
	}

	ngOnInit(): void {
		this.getTemplates();
		this.getUserDiagrams();
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
				this.UserDiagramsSrv.sendToRecyclingBin(id).subscribe({
					next: (value) => {},
					error(err) {
						Swal.fire({
							theme: 'dark',
							title: 'Error al enviar a la papelera',
							text: err,
							icon: 'error',
						});
					},
				});
				Swal.fire({
					title: 'Listo!',
					theme: 'dark',
					text: 'Puede ver el diagrama en la papelera',
					icon: 'success',
				});
			}
		});
	}

	sendTemplateJSON(id: number) {
		this.messageService.loadMessage();
		//Obtenemos los datos del diagrama, los enviamos y redigimos al usuario
		this.TemplatesService.getTemplateById(id).subscribe({
			next: (data: any) => {
				this.TemplatesService.template = data.diagram;
				this.DiagramTransferSrv.setType('template');
				this.DiagramTransferSrv.changeJSON(
					this.TemplatesService.template
				);
				Swal.close();
				this.router.navigate(['/diagram']);
			},
			error: (err: any) => console.error(err),
		});
	}

	addToFavorites(diagramId: number, isFavorite: boolean) {
		this.UserDiagramsSrv.favoriteDiagram(diagramId, isFavorite).subscribe({
			next: () => {
				const diagram = this.UserDiagramsSrv.allDiagrams.find(
					(d) => d.template_id === diagramId
				);
				if (diagram) diagram.is_favorite = isFavorite;

				Swal.fire({
					title: 'Favoritos',
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

	sendDiagramJSON(id: number) {
		this.messageService.loadMessage();
		//Obtenemos los datos del diagrama, los enviamos y redigimos al usuario
		this.UserDiagramsSrv.getDiagramById(id).subscribe({
			next: (data: any) => {
				this.UserDiagramsSrv.currentDiagram = data.diagram;
				this.DiagramTransferSrv.setType('user');
				this.DiagramTransferSrv.changeJSON(
					this.UserDiagramsSrv.currentDiagram
				);
				Swal.close();
				this.router.navigate(['/diagram']);
			},
			error: (err: any) => console.error(err),
		});
	}

	getUserDiagrams() {
		this.UserDiagramsSrv.getDiagrams().subscribe({
			next: (data: any) => {
				this.UserDiagramsSrv.allDiagrams = data.diagrams.map(
					(diagram: any) => ({
						...diagram,
						is_favorite: false, // Por defecto, hasta que el usuario lo marque
					})
				);
			},
			error: (err: any) => {
				console.error(err);
			},
		});
	}

	getTemplates() {
		this.TemplatesService.getTemplates().subscribe({
			next: (data: any) => {
				this.TemplatesService.allTemplates = data.templates;
			},
			error: (err: any) => {
				console.error(err);
			},
		});
	}
}
