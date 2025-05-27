import { BaseDiagram } from '../diagram';
import * as go from 'gojs';

export class FlowDiagram extends BaseDiagram {
	protected override configureDiagram(): void {
		this.diagram.model = go.Model.fromJson({
			class: 'GraphLinksModel',
			linkKeyProperty: 'key',
			linkFromPortIdProperty: 'fromPort',
			linkToPortIdProperty: 'toPort',
			modelData: { prop: 'value' },
			nodeDataArray: [
				{
					key: 1,
					category: 'TextNode',
					text: 'Texto',
					color: '#ffffff',
					textBgColor: null,
					font: '16px Adamina',
					borderWidth: 1,
					loc: '-101.89690907555305 -127.98857625084602',
				},
				{
					key: 2,
					category: 'DiamondNode',
					text: 'Texto',
					color: '#ffffff',
					textBgColor: null,
					font: '16px Adamina',
					borderWidth: 1,
					loc: '144.38951619947983 38',
				},
			],
			linkDataArray: [
				{
					from: 1,
					to: 2,
					fromPort: 'R',
					toPort: 'L',
					key: -1,
					points: [
						-72.55524190026009, -127.98857625084602,
						-62.555241900260086, -127.98857625084602, -60,
						-127.98857625084602, -60, 38, 104.29784902418685, 38,
						114.29784902418685, 38,
					],
				},
			],
		});
	}
	protected override state = {
		// Diagram state props
		// diagramNodeData: [
		// 	{ category: 'TextNode' },
		// 	{ key: 'Alpha', text: 'Alpha', color: 'lightblue', loc: '0 0' },
		// ],
		// diagramLinkData: [],
		// diagramModelData: { prop: 'value' },
		// skipsDiagramUpdate: false,
		// selectedNodeData: null, // used by InspectorComponent
	};
}
