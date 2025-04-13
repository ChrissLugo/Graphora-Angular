import { BaseNode } from './base-node';
import * as go from 'gojs';

export class DiamondNode extends BaseNode {
	override nodoConfig(): go.Node {
		return new go.Node('Auto', {
			resizable: true,
			width: 60,
			height: 40,
		}).add(
			new go.Shape('Diamond', {
				fill: 'white',
				stroke: 'red',
				strokeWidth: 2,
			}),
			// Bloque de texto en color blanco
			new go.TextBlock('', {
				margin: 8,
				stroke: 'black', // color del texto
				editable: false,
			})
		);
	}
}
