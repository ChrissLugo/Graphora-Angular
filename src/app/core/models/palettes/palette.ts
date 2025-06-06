import * as go from 'gojs';

export class NodePalette {
	itemtemplates = new go.Map<any, any>();

	constructor() {
		this.createPalette();
	}

	private createPalette() {
		const $ = go.GraphObject.make;

		// === DEFINICIÓN DE NODE TEMPLATES ===

		this.itemtemplates.add(
			'EmptyNode',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'RoundedRectangle', {
					fill: 'transparent',
					stroke: null,
					desiredSize: new go.Size(80, 60),
				}),
				$(
					go.TextBlock,
					{
						margin: 5,
						editable: false,
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'TextNode',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'RoundedRectangle', {
					fill: 'transparent',
					stroke: null,
					strokeWidth: 2,
					desiredSize: new go.Size(80, 50),
				}),
				$(
					go.TextBlock,
					{
						margin: 8,
						editable: false,
						stroke: '#fff',
						font: '14px sans-serif',
						text: 'Texto',
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'DiamondNode',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'Diamond', {
					fill: 'transparent',
					stroke: 'red',
					strokeWidth: 5,
					desiredSize: new go.Size(70, 70),
				}),
				$(
					go.TextBlock,
					{
						margin: 8,
						editable: false,
						stroke: '#fff',
						font: '14px sans-serif',
						text: 'Texto',
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'ContainerNode',
			$(
				go.Node,
				'Auto',
				// 1) la forma de fondo
				$(go.Shape, 'RoundedRectangle', {
					fill: '#000',
					stroke: '#fff',
					strokeWidth: 2,
					desiredSize: new go.Size(70, 70),
				}),
				// 2) el TextBlock anclado arriba-dentro de la forma
				$(go.TextBlock, new go.Binding('text'), {
					alignment: go.Spot.Top, // ancla el TextBlock al borde superior del contenedor
					alignmentFocus: go.Spot.Top, // el punto de referencia del TextBlock es su propio tope
					margin: new go.Margin(2, 0, 0, 0), // deja 2px de separación entre texto y borde
					editable: false,
					stroke: '#fff',
					font: '10px sans-serif',
				})
			)
		);

		this.itemtemplates.add(
			'CircleNode',
			$(
				go.Node,
				'Spot',
				$(go.Shape, 'Ellipse', {
					fill: '#970FF7',
					strokeWidth: 2,
					desiredSize: new go.Size(80, 60),
				}),
				$(
					go.TextBlock,
					{
						alignment: go.Spot.Center,
						editable: false,
						stroke: '#fff',
						font: '13px sans-serif',
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'ActorNode',
			$(
				go.Node,
				'Spot',
				$(go.Shape, 'Ellipse', {
					fill: '#fff',
					strokeWidth: 2,
					desiredSize: new go.Size(80, 60),
				}),
				$(
					go.TextBlock,
					{
						alignment: go.Spot.Center,
						editable: false,
						stroke: '#fff',
						font: '13px sans-serif',
					},
					new go.Binding('text')
				)
			)
		);
	}

	/**
	 * Devuelve la instancia de go.Palette creada.
	 */
	public getTemplates() {
		return this.itemtemplates;
	}
}
