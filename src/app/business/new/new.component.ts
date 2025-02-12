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
		this.diagram = new go.Diagram(this.diagramDiv.nativeElement, {
			'undoManager.isEnabled': true,
			'grid.visible': true,
		});

		this.diagram.toolManager.draggingTool.isGridSnapEnabled = true;
		this.diagram.toolManager.resizingTool.isGridSnapEnabled = true;

		// this.diagram.toolManager = new go.ToolManager({
		// 	'draggingTool.isGridSnapEnabled': true,
		// 	'resizingTool.isGridSnapEnabled': true,
		// });

		this.diagram.linkTemplate = go.GraphObject.make(
			go.Link,
			go.GraphObject.make(go.Shape, { strokeWidth: 2, stroke: 'white' }),
			go.GraphObject.make(go.Shape, {
				toArrow: 'OpenTriangle',
				fill: 'white',
				stroke: 'white',
				strokeWidth: 2,
			})
		);

		this.diagram.grid = new go.Panel('Grid', {
			gridCellSize: new go.Size(10, 10),
		}).add(
			new go.Shape('LineH', { stroke: '#1b1b1b' }),
			new go.Shape('LineV', { stroke: '#1b1b1b' }),
			new go.Shape('LineH', { stroke: '#2a2a2a', interval: 5 }),
			new go.Shape('LineV', { stroke: '#2a2a2a', interval: 5 })
		);

		this.diagram.nodeTemplate = new go.Node('Auto', {
			resizable: true,
		}).add(
			new go.Shape('RoundedRectangle', { strokeWidth: 0, fill: 'white' }),
			new go.TextBlock('Default Text', {
				margin: 12,
				stroke: 'black',
				font: 'bold 16px sans-serif',
			}).bind('text', 'key')
		);

		this.diagram.model = new go.GraphLinksModel(
			// Array de nodos
			[
				{ key: 'Alpha' },
				{ key: 'Beta' },
				{ key: 'Gamma' },
				{ key: 'Delta' },
			],
			// Enlaces
			[
				{ from: 'Alpha', to: 'Beta' },
				{ from: 'Alpha', to: 'Gamma' },
				{ from: 'Beta', to: 'Beta' },
				{ from: 'Gamma', to: 'Delta' },
			]
		);
	}
}
