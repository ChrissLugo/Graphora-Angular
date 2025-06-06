import * as go from 'gojs';

export class AllPalette {
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
					fill: null,
					stroke: null,
					desiredSize: new go.Size(80, 120),
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

		// DIAGRAMA CASOS DE USO

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
				new go.Shape('Circle', {
					name: 'HEAD',
					width: 20,
					height: 20,
					stroke: 'white',
					fill: null,
					strokeWidth: 4,
					alignment: go.Spot.Top,
					alignmentFocus: go.Spot.Top,
				}),
				//Cuerpo
				new go.Shape({
					geometry: go.Geometry.parse('F M0 20 L0 48'),
					stroke: '#fff',
					strokeWidth: 4,
					alignment: go.Spot.Top,
					alignmentFocus: go.Spot.Top,
				}),
				// Brazos
				new go.Shape({
					geometry: go.Geometry.parse('F M0 26 L25 26'),
					stroke: '#fff',
					strokeWidth: 4,
					alignment: go.Spot.Top,
					alignmentFocus: go.Spot.Top,
				}),
				// // Pierna derecha
				new go.Shape({
					geometry: go.Geometry.parse('F M10 48 L20 70'),
					stroke: '#fff',
					strokeWidth: 4,
					alignment: go.Spot.Top,
					alignmentFocus: go.Spot.Top,
				}),
				// Pierna izquierda
				new go.Shape({
					geometry: go.Geometry.parse('F M-10 48 L-20 70'),
					stroke: '#fff',
					strokeWidth: 4,
					alignment: go.Spot.Top,
					alignmentFocus: go.Spot.Top,
				})
			)
		);
	}

	public getPalette() {
		const palette = {
			paletteNodeData: [
				{ category: 'EmptyNode' },
				{ category: 'EmptyNode' },
				{ category: 'DiamondNode', text: 'Texto', color: '#ffffff' },
				{
					category: 'ContainerNode',
					text: 'Contenedor',
					color: '#ffffff',
				},
				{ category: 'TextNode', text: 'Texto', color: '#ffffff' },
				{ category: 'CircleNode', text: 'CU', color: '#ffffff' },
				{ category: 'ActorNode', text: 'Actor', color: '#ffffff' },
			],
			paletteModelData: { prop: 'val' },
		};
		return palette;
	}

	public getTemplates() {
		return this.itemtemplates;
	}
}
