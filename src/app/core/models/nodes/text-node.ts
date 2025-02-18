import { BaseNode } from './base-node';
import * as go from 'gojs';

export class TextNode extends BaseNode {
	override nodoConfig(): go.Node {
		return new go.Node('Auto', {
			resizable: true,
		}).add(
			new go.Shape('RoundedRectangle', {
				fill: 'transparent',
				stroke: 'white',
				strokeWidth: 0,
			}),
			// Bloque de texto en color blanco
			new go.TextBlock('Texto', {
				margin: 8,
				stroke: 'white', // color del texto
				editable: false,
			})
		);
	}
}
