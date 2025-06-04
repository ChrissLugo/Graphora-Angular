import { Component, OnInit } from '@angular/core';
import { DiagramMakerService } from '../../core/services/diagram/diagram-maker.service';
import { RouterModule } from '@angular/router';
import { TemplatesService } from '../../services/API/Templates.Service';

@Component({
	selector: 'app-home',
	imports: [RouterModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
	constructor(
		private diagraMaker: DiagramMakerService,
		public TemplatesService: TemplatesService
	) {}

	ngOnInit(): void {
		this.getTemplates();
	}

	getTemplates() {
		this.TemplatesService.getTemplates().subscribe({
			next: (data: any) => {
				this.TemplatesService.allTemplates = data.templates;
				console.log('Templates', this.TemplatesService.allTemplates);
			},
			error: (err) => {
				console.error(err);
			},
		});
	}
}
