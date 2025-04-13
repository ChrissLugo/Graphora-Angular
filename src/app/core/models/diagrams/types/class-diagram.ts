import { BaseDiagram } from '../diagram';
import * as go from 'gojs';

export class ClassDiagram extends BaseDiagram {
	protected override configureDiagram(): void {}

	protected override state = {
		// Diagram state props
		diagramNodeData: [
			{ key: 1, category: 'TextNode', text: 'Texto', color: 'white' },
			{ key: 2, category: 'TextNode', text: 'Texto', color: 'white' },
		],
		diagramLinkData: [],
		diagramModelData: { prop: 'value' },

		skipsDiagramUpdate: false,
		selectedNodeData: null, // used by InspectorComponent
	};
}
