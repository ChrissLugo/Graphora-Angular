import { BaseNode } from './base-node';
import * as go from 'gojs';

export class EmptyNode extends BaseNode {
	override nodoConfig(): go.Node {
		return new go.Node('Auto', {
			width: 50,
			height: 100,
		}).add(
			new go.Shape('RoundedRectangle', {
				fill: 'transparent',
				stroke: 'white',
				strokeWidth: 0,
			}),
			// Bloque de texto en color blanco
			new go.TextBlock('', {
				margin: 5,
				stroke: 'white', // color del texto
				editable: true,
			})
		);
	}
}
