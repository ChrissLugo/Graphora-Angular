import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	ElementRef,
	EventEmitter,
	Input,
	NgZone,
	Output,
	ViewChild,
} from '@angular/core';

import * as go from 'gojs';

@Component({
	selector: 'app-new',
	imports: [RouterLink],
	templateUrl: './new.component.html',
	styleUrl: './new.component.css',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	encapsulation: ViewEncapsulation.None,
})
export default class NewComponent {
	// Referencia al div que contendrá el diagrama
	@ViewChild('myDiagramDiv', { static: true })
	diagramDiv!: ElementRef<HTMLDivElement>;
	public diagram!: go.Diagram;

	constructor() {}

	ngAfterViewInit(): void {
		// Inicializa el diagrama usando el div referenciado
		this.diagram = new go.Diagram(this.diagramDiv.nativeElement, {
			'undoManager.isEnabled': true,
		});

		// Define un template para los nodos (aquí se usa un nodo simple con un rectángulo redondeado)
		this.diagram.nodeTemplate = new go.Node('Auto').add(
			new go.Shape('RoundedRectangle', { strokeWidth: 0, fill: 'white' })
		);

		// Define el modelo del diagrama (nodos y enlaces)
		this.diagram.model = new go.GraphLinksModel(
			// Array de nodos
			[
				{ key: 'Alpha' },
				{ key: 'Beta' },
				{ key: 'Gamma' },
				{ key: 'Delta' },
			],
			// Array de enlaces (conexiones entre nodos)
			[
				{ from: 'Alpha', to: 'Beta' },
				{ from: 'Alpha', to: 'Gamma' },
				{ from: 'Beta', to: 'Beta' },
				{ from: 'Gamma', to: 'Delta' },
			]
		);
	}
}
