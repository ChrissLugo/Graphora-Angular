import { BaseNode } from './base-node';
import * as go from 'gojs';

export class StartNodeFlow extends BaseNode {
	override nodoConfig(): go.Node {
		return new go.Node('Auto', {
			resizable: true,
			width: 80,
			height: 40,
		}).add(
			new go.Shape('Capsule', {
				fill: 'white',
				stroke: 'white',
				strokeWidth: 2,
			}),
			// Bloque de texto en color blanco
			new go.TextBlock('Inicio', {
				margin: 8,
				stroke: 'black', // color del texto
				editable: false,
			})
		);
	}
}
