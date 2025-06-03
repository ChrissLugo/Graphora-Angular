import * as go from 'gojs';

export class EmptyNode {
	protected node: go.Node;
	constructor() {
		this.node = new go.Node('Auto', {
			width: 70,
			height: 100,
		}).add(
			new go.Shape('RoundedRectangle', {
				fill: 'transparent',
				strokeWidth: 0,
			}),
			// Bloque de texto en color blanco
			new go.TextBlock('', {
				margin: 5,

				editable: true,
			})
		);
	}

	public getNode() {
		return this.node;
	}
}
