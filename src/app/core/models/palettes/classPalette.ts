import * as go from 'gojs';

export class ClassPalette {
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

		// DIAGRAMA DE CLASES
		this.nodeTemplates.add(
			'ClassNode',
			$(
				go.Node,
				'Auto',
				new go.Panel('Vertical', {
					stretch: go.GraphObject.Horizontal,
				}).add(
					new go.Panel('Auto', {
						stretch: go.GraphObject.Horizontal,
					}).add(
						new go.Shape('Rectangle', {
							stroke: 'black',
							height: 20,
							fill: '#c27aff',
						}),
						new go.TextBlock('Texto', {
							name: 'TEXTBLOCK',
							margin: 8,
							text: 'Clase',
							stroke: 'black',
							editable: false,
							isMultiline: true,
						})
					),
					new go.Shape('Rectangle', {
						fill: 'white',
						stroke: 'black',
						height: 50,
					})
				)
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
					category: 'ClassNode',
					text: 'Clase',
					texto: 'Texto inicial',
					group: '',
					// color: 'gray',
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
