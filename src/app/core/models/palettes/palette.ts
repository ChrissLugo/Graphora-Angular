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
			'Rectangle',
			$(
				go.Node,
				'Auto',
				$(go.Shape, 'Rectangle', {
					fill: '#ACE600',
					stroke: '#333',
					strokeWidth: 2,
				}),
				$(
					go.TextBlock,
					{
						margin: 8,
						editable: false,
						stroke: '#111',
						font: '14px sans-serif',
					},
					new go.Binding('text')
				)
			)
		);

		this.itemtemplates.add(
			'Triangle',
			$(
				go.Node,
				'Spot',
				$(go.Shape, 'Triangle', {
					fill: '#1ABC9C',
					stroke: '#333',
					strokeWidth: 2,
					desiredSize: new go.Size(80, 60),
				}),
				$(
					go.TextBlock,
					{
						alignment: go.Spot.Center,
						editable: false,
						stroke: '#111',
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
