import * as go from 'gojs';

export class TextNode {
	protected node: go.Node;
	constructor() {
		this.node = new go.Node('Auto', { resizable: true });
		this.node.add(
			new go.Shape('RoundedRectangle', {
				fill: 'transparent',
				stroke: 'white',
				strokeWidth: 0,
			}),
			new go.TextBlock('Texto', {
				margin: 8,
				editable: true, // Permite editar el texto directamente en el diagrama
			})
				// Binding bidireccional para la propiedad 'text'
				.bind(new go.Binding('text', 'text').makeTwoWay())
				// Binding bidireccional para la propiedad 'stroke' (color del texto)
				.bind(new go.Binding('stroke', 'color').makeTwoWay())
		);
	}

	public getNode() {
		return this.node;
	}
}
