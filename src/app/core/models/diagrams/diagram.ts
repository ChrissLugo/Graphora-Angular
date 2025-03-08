import { ActivatedRoute, Route } from '@angular/router';
import go from 'gojs';

export abstract class BaseDiagram {
	protected diagram: go.Diagram;
	protected abstract state: object;

	// protected palette: go.Palette;

	constructor() {
		//Configuraciones generales de diagrama
		this.diagram = new go.Diagram({
			'undoManager.isEnabled': true,
			'animationManager.isEnabled': true,
			'grid.visible': true,
			'draggingTool.isGridSnapEnabled': true,
			initialContentAlignment: go.Spot.Center,
			allowLink: true,
			allowRotate: true,
			model: new go.GraphLinksModel({
				linkToPortIdProperty: 'toPort',
				linkFromPortIdProperty: 'fromPort',
				linkKeyProperty: 'key',
			}),
		});

		function makePort(id: string, spot: go.Spot) {
			return new go.Shape('Circle', {
				desiredSize: new go.Size(8, 8),
				opacity: 0.5,
				fill: 'gray',
				strokeWidth: 0,
				portId: id,
				alignment: spot,
				fromSpot: spot,
				toSpot: spot,
				fromLinkable: true,
				toLinkable: true,
				cursor: 'pointer',
			});
		}

		// Configurar la cuadricula personalizada
		this.diagram.grid = new go.Panel('Grid', {
			gridCellSize: new go.Size(10, 10),
		}).add(
			new go.Shape('LineH', { stroke: '#1b1b1b' }),
			new go.Shape('LineV', { stroke: '#1b1b1b' }),
			new go.Shape('LineH', { stroke: '#2a2a2a', interval: 5 }),
			new go.Shape('LineV', { stroke: '#2a2a2a', interval: 5 })
		);

		// define the Node template
		this.diagram.nodeTemplate = new go.Node('Spot', {
			contextMenu: (
				go.GraphObject.build('ContextMenu') as go.Adornment
			).add(
				(go.GraphObject.build('ContextMenuButton') as go.Panel).add(
					new go.TextBlock('Group', {
						click: (e, obj) =>
							e.diagram.commandHandler.groupSelection(),
					})
				)
			),
		})
			.bindTwoWay(
				'location',
				'loc',
				go.Point.parse,
				go.Point.stringifyFixed(1)
			)
			.add(
				new go.Panel('Auto').add(
					new go.Shape('RoundedRectangle', { strokeWidth: 0.5 }).bind(
						'fill',
						'color'
					),
					new go.TextBlock({ margin: 8, editable: true }).bindTwoWay(
						'text'
					)
				),
				// Ports
				makePort('t', go.Spot.Top),
				makePort('l', go.Spot.Left),
				makePort('r', go.Spot.Right),
				makePort('b', go.Spot.Bottom)
			);

		this.diagram.linkTemplate = new go.Link({
			// curve: go.Curve.Bezier,
			fromEndSegmentLength: 30,
			toEndSegmentLength: 30,
		}).add(
			new go.Shape({ strokeWidth: 1.5, stroke: 'white' }),
			new go.Shape({
				toArrow: 'Standard',
				stroke: 'white',
				fill: 'white',
			})
		);

		// Llamada a configuración adicional que se definirá en subclases
		this.configureDiagram();
	}

	// Método abstracto para que las subclases puedan configurar el diagrama adicionalmente
	protected abstract configureDiagram(): void;

	public getState(): Object {
		return this.state;
	}

	public getDiagram(): go.Diagram {
		return this.diagram;
	}
}
