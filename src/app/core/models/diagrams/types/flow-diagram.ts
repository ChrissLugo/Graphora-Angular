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
					loc: '-264.8135770137855 -161.57357600289072',
				},
				{
					key: 2,
					category: 'DiamondNode',
					text: 'Texto',
					color: '#ffffff',
					textBgColor: null,
					font: '16px Adamina',
					borderWidth: 1,
					loc: '-35.27715555344986 44.830000495910646',
				},
				{
					key: -3,
					category: 'TextNode',
					text: 'Texto',
					color: '#fff',
					loc: '2.6030871097497084 -116.66999950408933',
				},
				{
					key: -4,
					category: 'TextNode',
					text: 'Texto',
					color: '#fff',
					loc: '248.6030871097497 79.33000049591067',
				},
				{
					key: -5,
					category: 'TextNode',
					text: 'Texto',
					color: '#fff',
					loc: '154.6030871097497 359.33000049591067',
				},
				{
					key: -6,
					category: 'TextNode',
					text: 'Texto',
					color: '#fff',
					loc: '-138.3969128902503 366.33000049591067',
				},
				{
					key: -7,
					category: 'TextNode',
					text: 'Texto',
					color: '#fff',
					loc: '-264.8135770137855 198.33000049591067',
				},
				{
					key: -8,
					category: 'TextNode',
					text: 'asdfasdfasdf',
					color: '#fff',
					loc: '-485.8083381652832 -136.8',
					font: '16px ADLaM Display',
					alignment: {
						class: 'go.Spot',
						x: 0.5,
						y: 0.5,
						offsetX: 0,
						offsetY: 0,
					},
					textBgColor: '#9141ac',
					borderColor: '#63452c',
					borderWidth: 7,
					borderStyle: [6, 4],
					shapeBgColor: '#f6f5f4',
				},
				{
					key: -9,
					category: 'TextNode',
					text: 'Texto',
					color: '#fff',
					loc: '114.60308710974971 -187.66999950408933',
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
						-238.38857777672493, -161.57357600289072,
						-228.38857777672493, -161.57357600289072, -228,
						-161.57357600289072, -228, 44.83000049591065,
						-72.45215479051042, 44.83000049591065,
						-62.45215479051042, 44.83000049591065,
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
