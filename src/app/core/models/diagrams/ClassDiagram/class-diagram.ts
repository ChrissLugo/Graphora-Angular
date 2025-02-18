// flow-diagram.ts
import { Diagram } from '../diagram';
import * as go from 'gojs';

export class ClassDiagram extends Diagram {
	override configureDiagram(): void {
		// this.diagram.nodeTemplate = this.getFlowNodeTemplate();
		// this.diagram.linkTemplate = this.getFlowLinkTemplate();
	}

	// private getFlowNodeTemplate(): go.Node {
	// 	return $(
	// 		go.Node,
	// 		'Auto',
	// 		$(
	// 			go.Shape,
	// 			'RoundedRectangle',
	// 			{ strokeWidth: 0 },
	// 			new go.Binding('fill', 'color')
	// 		),
	// 		$(go.TextBlock, { margin: 8 }, new go.Binding('text', 'label'))
	// 	);
	// }

	// private getFlowLinkTemplate(): go.Link {
	// 	return $(
	// 		go.Link,
	// 		{ routing: go.Link.AvoidsNodes, curve: go.Link.JumpOver },
	// 		$(go.Shape) // la línea
	// 	);
	// }
}
