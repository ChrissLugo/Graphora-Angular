// import { BaseDiagram } from '../diagram';
// import * as go from 'gojs';

// export class FlowDiagram extends BaseDiagram {
// 	protected override configureDiagram(): void {
// 		console.log('Antes', this.diagram.model.toJson());
// 		this.diagram.model = go.Model.fromJson({
// 			class: 'GraphLinksModel',
// 			linkKeyProperty: 'key',
// 			linkFromPortIdProperty: 'fromPort',
// 			linkToPortIdProperty: 'toPort',
// 			modelData: { prop: 'value' },
// 			nodeDataArray: [
// 				{
// 					key: 1,
// 					category: 'TextNode',
// 					text: 'hola amiguito',
// 					color: '#ffffff',
// 					textBgColor: null,
// 					font: '16px Adamina',
// 					borderWidth: 1,
// 					loc: '7.361424130623675 -248.48690941887583',
// 				},
// 				{
// 					key: 2,
// 					category: 'DiamondNode',
// 					text: 'Texto',
// 					color: '#ffffff',
// 					textBgColor: null,
// 					font: '16px Adamina',
// 					borderWidth: 1,
// 					loc: '-335.57715097581314 -39.99666633605957',
// 				},
// 			],
// 			linkDataArray: [
// 				{
// 					from: 1,
// 					to: 2,
// 					fromPort: 'B',
// 					toPort: 'T',
// 					key: -1,
// 					points: [
// 						7.361424130623682, -230.7352425869056,
// 						7.361424130623682, -220.7352425869056,
// 						7.361424130623682, -144.6167878774677,
// 						-335.57715097581314, -144.6167878774677,
// 						-335.57715097581314, -68.49833316802979,
// 						-335.57715097581314, -58.49833316802979,
// 					],
// 				},
// 			],
// 		});
// 		console.log('Despues', this.diagram.model.toJson());
// 	}
// 	protected override state = {
// 		// Diagram state props
// 		// diagramNodeData: [
// 		// 	{ category: 'TextNode' },
// 		// 	{ key: 'Alpha', text: 'Alpha', color: 'lightblue', loc: '0 0' },
// 		// ],
// 		// diagramLinkData: [],
// 		// diagramModelData: { prop: 'value' },
// 		// skipsDiagramUpdate: false,
// 		// selectedNodeData: null, // used by InspectorComponent
// 	};
// }
