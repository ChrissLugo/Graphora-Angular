import { BaseDiagram } from '../diagram';
import * as go from 'gojs';

export class ClassDiagram extends BaseDiagram {
	protected override configureDiagram(): void {}

	protected override state = {
		// Diagram state props
		diagramNodeData: [{ category: 'TextNode' }, { category: 'TextNode' }],
		diagramLinkData: [],
		diagramModelData: { prop: 'value' },

		skipsDiagramUpdate: false,
		selectedNodeData: null, // used by InspectorComponent
	};
}
