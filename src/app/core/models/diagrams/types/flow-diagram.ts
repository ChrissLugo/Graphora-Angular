import { BaseDiagram } from '../diagram';
import * as go from 'gojs';

export class FlowDiagram extends BaseDiagram {
	protected override configureDiagram(): void {}
	protected override state = {
		// Diagram state props
		diagramNodeData: [
			{ category: 'TextNode' },
			{ key: 'Alpha', text: 'Alpha', color: 'lightblue', loc: '0 0' },
		],
		diagramLinkData: [],
		diagramModelData: { prop: 'value' },

		skipsDiagramUpdate: false,
		selectedNodeData: null, // used by InspectorComponent
	};
}
