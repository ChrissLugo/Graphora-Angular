import * as go from 'gojs';

export class PackagePalette {
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

		// DIAGRAMA DE PAQUETES
		this.nodeTemplates.add(
			'PackageNode',
			$(
				go.Node,
				'Auto',
				{
					minSize: new go.Size(90, 50),
					maxSize: new go.Size(90, Infinity),
				},
				new go.Panel('Vertical', {
					stretch: go.GraphObject.Fill,
				}).add(
					new go.Shape('Rectangle', {
						stretch: go.GraphObject.Horizontal,

						fill: 'white',
						stroke: 'black',
						minSize: new go.Size(50, 20),
						maxSize: new go.Size(50, 20),
					}),
					new go.Panel('Auto', {
						stretch: go.GraphObject.Horizontal,
					}).add(
						new go.Shape('Rectangle', {
							stroke: 'black',
							height: 50,
							fill: 'white',
						}),
						new go.TextBlock('Texto', {
							name: 'TEXTBLOCK',
							margin: 8,
							text: 'Paquete',
							stroke: 'black',
							editable: false,
							isMultiline: true,
						})
					)
				)
			)
		);

		this.nodeTemplates.add(
			'PackageContainerNode',
			$(
				go.Node,
				'Auto',
				{
					minSize: new go.Size(90, 50),
					maxSize: new go.Size(90, Infinity),
				},
				new go.Panel('Vertical', {
					stretch: go.GraphObject.Fill,
				}).add(
					new go.Panel('Auto', {
						stretch: go.GraphObject.Horizontal,
					}).add(
						new go.Shape('Rectangle', {
							stroke: 'black',

							minSize: new go.Size(50, 20),
							maxSize: new go.Size(50, 20),
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
					new go.Shape('Rectangle', {
						stretch: go.GraphObject.Horizontal,
						height: 50,
						fill: 'transparent',
						stroke: 'white',
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
					category: 'PackageNode',
					text: 'Paquete',
					texto: 'Texto inicial',
					group: '',
				},
				{
					category: 'PackageContainerNode',
					text: 'Paquete',
					texto: 'Texto inicial',
					group: '',
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
