import * as go from 'gojs';

export class FiguresPalette {
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
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'RectangleNode',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'Rectangle', {
					fill: 'transparent',
					stroke: 'blue',
					strokeWidth: 5,
					desiredSize: new go.Size(80, 80),
				}),
				$(
					go.TextBlock,
					{
						margin: 8,
						editable: false,
						stroke: '#fff',
						font: '14px sans-serif',
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'RoundedRectangleNode',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'RoundedRectangle', {
					fill: 'transparent',
					stroke: 'green',
					strokeWidth: 5,
					desiredSize: new go.Size(80, 80),
				}),
				$(
					go.TextBlock,
					{
						margin: 8,
						editable: false,
						stroke: '#fff',
						font: '14px sans-serif',
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'Circle2Node',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'Capsule', {
					fill: 'transparent',
					stroke: 'yellow',
					strokeWidth: 5,
					desiredSize: new go.Size(80, 80),
				}),
				$(
					go.TextBlock,
					{
						margin: 8,
						editable: false,
						stroke: '#fff',
						font: '14px sans-serif',
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'TriangleUpNode',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'TriangleUp', {
					fill: 'transparent',
					stroke: 'pink',
					strokeWidth: 5,
					desiredSize: new go.Size(80, 80),
				}),
				$(
					go.TextBlock,
					{
						margin: 8,
						editable: false,
						stroke: '#fff',
						font: '14px sans-serif',
					},
					new go.Binding('text')
				)
			)
		);
	}

	public getPalette() {
		const palette = {
			paletteNodeData: [
				{ category: 'EmptyNode' },
				{ category: 'EmptyNode' },
				{ category: 'DiamondNode', color: '#ffffff' },
				{ category: 'RectangleNode', color: '#ffffff' },
				{ category: 'RoundedRectangleNode', color: '#ffffff' },
				{ category: 'Circle2Node', color: '#ffffff' },
				{ category: 'TriangleUpNode', color: '#ffffff' },
			],
			paletteModelData: { prop: 'val' },
		};
		return palette;
	}

	public getTemplates() {
		return this.itemtemplates;
	}
}
