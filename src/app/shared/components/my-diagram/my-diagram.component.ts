import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import * as go from 'gojs';
import {
	DataSyncService,
	DiagramComponent,
	OverviewComponent,
	PaletteComponent,
} from 'gojs-angular';
import { TextNode } from '../../../core/models/nodes/text-node';
import { InspectorComponent } from '../../../core/models/inspector/inspector.component';
import { CommonModule } from '@angular/common';
import { produce } from 'immer';
import { EmptyNode } from '../../../core/models/nodes/empty-node';
import { DiamondNode } from '../../../core/models/nodes/diamond-node';
import { GuidedDraggingTool } from './extensions/GuidedDraggingTool';
import { RotateMultipleTool } from './extensions/RotateMultipleTool';

@Component({
	selector: 'app-my-diagram',
	imports: [
		NavbarComponent,
		DiagramComponent,
		PaletteComponent,
		OverviewComponent,
		InspectorComponent,
		CommonModule,
	],
	templateUrl: './my-diagram.component.html',
	styleUrl: './my-diagram.component.css',
})
export default class MyDiagramComponent {
	@ViewChild('myDiagram', { static: true })
	public myDiagramComponent!: DiagramComponent;
	@ViewChild('myPalette', { static: true })
	public myPaletteComponent!: PaletteComponent;

	public selectedNodeData!: go.ObjectData;
	public observedDiagram: any = null;
	public diagram!: go.Diagram;

	constructor(private cdr: ChangeDetectorRef) {
		this.initDiagram2 = this.initDiagram2.bind(this);
	}

	public state = {
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
		selectedNodeData: null,
	};

	public getTemplateNodes = () => {
		const sharedTemplateMap = new go.Map<string, go.Node>();
		sharedTemplateMap.add('EmptyNode', new EmptyNode().getNode());
		sharedTemplateMap.add('TextNode', new TextNode().getNode());

		sharedTemplateMap.add('DiamondNode', new DiamondNode().getNode());
		return sharedTemplateMap;
	};

	public initDiagram2() {
		this.diagram = new go.Diagram({
			'undoManager.isEnabled': true,
			'animationManager.isEnabled': true,
			'grid.visible': true,
			'draggingTool.isGridSnapEnabled': true,
			draggingTool: new GuidedDraggingTool(),
			'draggingTool.horizontalGuidelineColor': 'blue',
			'draggingTool.verticalGuidelineColor': 'blue',
			'draggingTool.centerGuidelineColor': 'green',
			'draggingTool.guidelineWidth': 1,
			'draggingTool.dragsLink': true,
			'relinkingTool.isUnconnectedLinkValid': true,
			'relinkingTool.portGravity': 20,
			'linkingTool.isUnconnectedLinkValid': true,
			'linkingTool.portGravity': 20,
			rotatingTool: new RotateMultipleTool(),
			initialContentAlignment: go.Spot.Center,
			allowLink: true,
			allowRotate: true,
			model: new go.GraphLinksModel({
				linkToPortIdProperty: 'toPort',
				linkFromPortIdProperty: 'fromPort',
				linkKeyProperty: 'key',
			}),
		});

		//Agregar la plantilla de nodos
		this.diagram.nodeTemplateMap = this.getTemplateNodes();

		function makePort(id: string, spot: go.Spot) {
			return new go.Shape('Circle', {
				desiredSize: new go.Size(8, 8),
				opacity: 0.5,
				fill: 'gray',
				strokeWidth: 0,
				portId: id,
				alignment: spot,
				fromSpot: spot,
				toSpot: spot,
				fromLinkable: true,
				toLinkable: true,
				cursor: 'pointer',
			});
		}

		// Configurar la cuadricula personalizada
		this.diagram.grid = new go.Panel('Grid', {
			gridCellSize: new go.Size(10, 10),
		}).add(
			new go.Shape('LineH', { stroke: '#1b1b1b' }),
			new go.Shape('LineV', { stroke: '#1b1b1b' }),
			new go.Shape('LineH', { stroke: '#2a2a2a', interval: 5 }),
			new go.Shape('LineV', { stroke: '#2a2a2a', interval: 5 })
		);

		// Definir plantilla de nodos
		this.diagram.nodeTemplate = new go.Node('Spot', {
			contextMenu: (
				go.GraphObject.build('ContextMenu') as go.Adornment
			).add(
				(go.GraphObject.build('ContextMenuButton') as go.Panel).add(
					new go.TextBlock('Group', {
						click: (e, obj) =>
							e.diagram.commandHandler.groupSelection(),
					})
				)
			),
		})
			.bindTwoWay(
				'location',
				'loc',
				go.Point.parse,
				go.Point.stringifyFixed(1)
			)
			.add(
				new go.Panel('Auto').add(
					new go.Shape('RoundedRectangle', { strokeWidth: 0.5 }).bind(
						'fill',
						'color'
					),
					new go.TextBlock({ margin: 8, editable: true }).bindTwoWay(
						'text'
					)
				),
				// Ports
				makePort('t', go.Spot.Top),
				makePort('l', go.Spot.Left),
				makePort('r', go.Spot.Right),
				makePort('b', go.Spot.Bottom)
			);

		var linkSelectionAdornmentTemplate = new go.Adornment('Link').add(
			new go.Shape({
				isPanelMain: true, // isPanelMain declares that this Shape shares the Link.geometry
				fill: null,
				stroke: 'deepskyblue',
				strokeWidth: 0, // use selection object's strokeWidth
			})
		);

		this.diagram.linkTemplate = new go.Link({
			// the whole link panel
			selectable: true,
			selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
			relinkableFrom: true,
			relinkableTo: true,
			reshapable: true,
			routing: go.Routing.AvoidsNodes,
			curve: go.Curve.JumpOver,
			corner: 5,
			toShortLength: 4,
		})
			.bindTwoWay('points')
			.add(
				new go.Shape({
					isPanelMain: true,
					strokeWidth: 2,
					stroke: 'white',
				}),
				new go.Shape({
					toArrow: 'Standard',
					stroke: 'white',
					fill: 'white',
				})
			);
		return this.diagram;
	}

	public diagramModelChange = (changes: go.IncrementalData) => {
		if (!changes) return;
		const appComp = this;
		this.state = produce(this.state, (draft: any) => {
			// set skipsDiagramUpdate: true since GoJS already has this update
			// this way, we don't log an unneeded transaction in the Diagram's undoManager history
			draft.skipsDiagramUpdate = true;
			draft.diagramNodeData = DataSyncService.syncNodeData(
				changes,
				draft.diagramNodeData,
				appComp.observedDiagram.model
			);
			draft.diagramLinkData = DataSyncService.syncLinkData(
				changes,
				draft.diagramLinkData,
				appComp.observedDiagram.model
			);
			draft.diagramModelData = DataSyncService.syncModelData(
				changes,
				draft.diagramModelData
			);
			// If one of the modified nodes was the selected node used by the inspector, update the inspector selectedNodeData object
			const modifiedNodeData = changes.modifiedNodeData;
			if (modifiedNodeData && draft.selectedNodeData) {
				for (let i = 0; i < modifiedNodeData.length; i++) {
					const mn = modifiedNodeData[i];
					const nodeKeyProperty = appComp.myDiagramComponent.diagram
						.model.nodeKeyProperty as string;
					if (
						mn[nodeKeyProperty] ===
						draft.selectedNodeData[nodeKeyProperty]
					) {
						draft.selectedNodeData = mn;
					}
				}
			}
		});
	};

	public initPalette = (): go.Palette => {
		const palette = new go.Palette();

		//Se asigna la plantilla de los nodos
		palette.nodeTemplateMap = this.getTemplateNodes();

		return palette;
	};

	public ngAfterViewInit() {
		if (this.observedDiagram) return;
		this.observedDiagram = this.myDiagramComponent.diagram;
		this.cdr.detectChanges(); // IMPORTANT: without this, Angular will throw ExpressionChangedAfterItHasBeenCheckedError (dev mode only)

		const appComp: any = this;
		// listener for inspector
		this.myDiagramComponent.diagram.addDiagramListener(
			'ChangedSelection',
			function (e) {
				if (e.diagram.selection.count === 0) {
					appComp.selectedNodeData = null;
				}
				const node = e.diagram.selection.first();
				appComp.state = produce(appComp.state, (draft: any) => {
					if (node instanceof go.Node) {
						var idx = draft.diagramNodeData.findIndex(
							(nd: any) => nd.key == node.data.key
						);
						var nd = draft.diagramNodeData[idx];
						draft.selectedNodeData = nd;
					} else {
						draft.selectedNodeData = null;
					}
				});
			}
		);
	}

	public allPaletteState = {
		paletteNodeData: [
			{ category: 'EmptyNode' },
			{ category: 'EmptyNode' },

			{ key: 1, category: 'TextNode', text: 'Texto', color: '#fff' },
			{ key: 2, category: 'DiamondNode', text: 'Texto', color: '#fff' },
		],
		paletteModelData: { prop: 'val' },
	};

	public initOverview(): go.Overview {
		return new go.Overview();
	}

	// @param changedPropAndVal
	public handleInspectorChange(changedPropAndVal: any) {
		const path = changedPropAndVal.prop;
		const value = changedPropAndVal.newVal;
		console.log('datos recibidos', changedPropAndVal);

		this.state = produce(this.state, (draft: any) => {
			var data = draft.selectedNodeData;
			data[path] = value;
			const key = data.key;
			const idx = draft.diagramNodeData.findIndex(
				(nd: any) => nd.key == key
			);
			if (idx >= 0) {
				draft.diagramNodeData[idx] = data;
				draft.skipsDiagramUpdate = false; // we need to sync GoJS data with this new app state, so do not skips Diagram update
			}
		});
	}
}
