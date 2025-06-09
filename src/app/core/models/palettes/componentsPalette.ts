import * as go from 'gojs';

export class ComponentsPalette {
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

		// DIAGRAMA DE COMPONENTES
		this.nodeTemplates.add(
			'ComponentNode',
			$(
				go.Node,
				'Position',
				{
					minSize: new go.Size(90, 50),
					maxSize: new go.Size(90, Infinity),
				},
				new go.Panel('Auto', {
					stretch: go.GraphObject.Fill,
				}).add(
					new go.Shape('RoundedRectangle', {
						stroke: 'white',
						minSize: new go.Size(80, 50),
						maxSize: new go.Size(80, 50),
						fill: 'white',
					}),
					new go.TextBlock('Texto', {
						name: 'TEXTBLOCK',
						margin: 8,
						text: '',
						stroke: 'black',
						editable: false,
						isMultiline: true,
					})
				),
				new go.Shape('RoundedRectangle', {
					position: new go.Point(-10, 10),
					width: 20,
					height: 10,
					name: 'PANEL',
					fill: 'white',
					stroke: 'black',
				}),
				new go.Shape('RoundedRectangle', {
					position: new go.Point(-10, 25),
					width: 20,
					height: 10,
					name: 'PANEL',
					fill: 'white',
					stroke: 'black',
				})
			)
		);

		this.nodeTemplates.add(
			'InterfaceNode',
			$(
				go.Node,
				'Vertical',
				{
					minSize: new go.Size(90, 50),
					maxSize: new go.Size(90, Infinity),
				},
				new go.Panel('Auto', {}).add(
					new go.Shape('Ellipse', {
						stroke: 'white',
						minSize: new go.Size(40, 40),
						maxSize: new go.Size(40, 40),
						fill: '#970FF7',
					})
				),
				new go.TextBlock('Texto', {
					name: 'TEXTBLOCK',
					margin: 8,
					text: 'Interfaz',
					stroke: 'white',
					editable: false,
					isMultiline: true,
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
					category: 'ComponentNode',
					text: 'Paquete',
					texto: 'Texto inicial',
					group: '',
				},
				{
					category: 'InterfaceNode',
					text: 'Interfaz',
					color: '#ffffff',
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
