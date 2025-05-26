import { BaseDiagram } from '../diagram';
import go from 'gojs';

export class ClassDiagram extends BaseDiagram {
	protected override configureDiagram(): void {}

	protected override state = {
		// Diagram state props
		diagramNodeData: [
			{
				key: 1,
				category: 'TextNode',
				text: 'Texto',
				color: '#ffffff',
				textBgColor: null,
				font: '16px Adamina',
				borderWidth: 1,
			},
			{
				key: 2,
				category: 'DiamondNode',
				text: 'Texto',
				color: '#ffffff',
				textBgColor: null,
				font: '16px Adamina',
				borderWidth: 1,
			},
		],
		diagramLinkData: [],
		diagramModelData: { prop: 'value' },

		skipsDiagramUpdate: false,
		selectedNodeData: null, // used by InspectorComponent
	};
}
