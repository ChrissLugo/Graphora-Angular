import * as go from 'gojs';

export class SequencePalette {
	private nodeTemplates = new go.Map<any, any>();
	private groupTemplates = new go.Map<any, any>();

	constructor() {
		this.createPalette();
	}

	private createPalette() {
		const $ = go.GraphObject.make;

		// === DEFINICIÓN DE NODE TEMPLATES ===

		this.nodeTemplates.add(
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

		this.nodeTemplates.add(
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

		this.nodeTemplates.add(
			'DiamondNode',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'Diamond', {
					fill: 'transparent',
					stroke: 'red',
					strokeWidth: 5,
					desiredSize: new go.Size(80, 70),
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

		// DIAGRAMA DE SECUENCIA
		this.groupTemplates.add(
			'LifeLineNode',
			$(
				go.Group,
				'Vertical',
				{
					// No hace falta interacción en la paleta
					selectable: true,
					resizable: false,
					rotatable: false,
					locationSpot: go.Spot.Center,
					desiredSize: new go.Size(90, 70),
				},
				$(
					go.Panel,
					'Auto',
					{ name: 'HEADER' },
					$(go.Shape, 'Rectangle', {
						name: 'PANEL',
						// minSize: new go.Size(100, 40),
						fill: 'transparent',
						stroke: 'white',
						strokeWidth: 2,
					}),
					$(go.TextBlock, {
						name: 'TEXTBLOCK',
						text: 'Linea Libre',
						margin: 6,
						stroke: 'white',
						font: 'bold 10pt sans-serif',
					})
				),
				$(go.Shape, {
					figure: 'LineV',
					stroke: 'gray',
					strokeDashArray: [4, 4],
					width: 4,
					strokeWidth: 4,
					height: 200,
					alignment: go.Spot.Center,
				})
			)
		);
	}

	public getPalette() {
		const palette = {
			paletteNodeData: [
				{ category: 'EmptyNode' },
				{ category: 'EmptyNode' },
				{ category: 'TextNode', text: 'Texto', color: '#ffffff' },
				{
					category: 'LifeLineNode',
					isGroup: true,
					color: '#ffffff',
					text: 'Linea Libre',
				},
			],
			paletteModelData: { prop: 'val' },
		};
		return palette;
	}

	public getNodeTemplates() {
		return this.nodeTemplates;
	}

	public getGroupTemplates() {
		return this.groupTemplates;
	}
}
