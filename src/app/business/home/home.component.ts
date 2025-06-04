import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
	FaIconLibrary,
	FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
	faArrowRotateLeft,
	faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { TemplatesService } from '../../core/services/API/Templates/Templates.Service';
import { DiagramsTransferService } from '../../core/services/Data Transfer/DiagramsTransfer.service';
import { SwalMessageService } from '../../core/services/messages/swal-message.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-home',
	imports: [RouterModule, FontAwesomeModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
	constructor(
		public TemplatesService: TemplatesService,
		public DiagramTransferSrv: DiagramsTransferService,
		private router: Router,
		public messageService: SwalMessageService,
		icons: FaIconLibrary
	) {
		icons.addIcons(faArrowRotateLeft);
	}

	ngOnInit(): void {
		this.getTemplates();
	}

	sendTemplateJSON(id: number) {
		this.messageService.loadMessage();
		//Obtenemos los datos del diagrama, los enviamos y redigimos al usuario
		this.TemplatesService.getTemplateById(id).subscribe({
			next: (data: any) => {
				this.TemplatesService.template = data.diagram;
				this.DiagramTransferSrv.changeJSON(
					this.TemplatesService.template
				);
				Swal.close();
				this.router.navigate(['/diagram']);
			},
			error: (err: any) => console.error(err),
		});
	}

	sendDiagramJSON(id: number) {}

	getTemplates() {
		this.TemplatesService.getTemplates().subscribe({
			next: (data: any) => {
				this.TemplatesService.allTemplates = data.templates;
				console.log('Templates', this.TemplatesService.allTemplates);
			},
			error: (err: any) => {
				console.error(err);
			},
		});
	}
}
