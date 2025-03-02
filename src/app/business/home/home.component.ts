import { Component } from '@angular/core';
import { DiagramMakerService } from '../../core/services/diagram/diagram-maker.service';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-home',
	imports: [RouterModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export default class HomeComponent {
	constructor(private diagraMaker: DiagramMakerService) {}
}
