import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { current, produce } from 'immer';
import { DiamondNode } from '../../../core/models/nodes/diamond-node';
import { GuidedDraggingTool } from './extensions/GuidedDraggingTool';
import { RotateMultipleTool } from './extensions/RotateMultipleTool';
import { NodePalette } from '../../../core/models/palettes/palette';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatesService } from '../../../core/services/API/Templates/Templates.Service';
import { DiagramsTransferService } from '../../../core/services/Data Transfer/DiagramsTransfer.service';
import { faL } from '@fortawesome/free-solid-svg-icons';

interface ModelJson {
	modelData: any;
	nodeDataArray: any[];
	linkDataArray: any[];
}

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
export default class MyDiagramComponent implements OnInit {
	@ViewChild('myDiagram', { static: true })
	public myDiagramComponent!: DiagramComponent;
	@ViewChild('myPalette', { static: true })
	public myPaletteComponent!: PaletteComponent;

	public selectedNodeData!: go.ObjectData;
	public observedDiagram: any = null;
	public diagram!: go.Diagram;
	public diagramJSON!: any;
	public diagramName!: string;
	public openFile: boolean = false;
	private isLoading: boolean = true;
	private theme = 'dark';
	//Variables Autosave
	public isSave!: boolean;
	public isSaving: boolean = true;

	constructor(
		private cdr: ChangeDetectorRef,
		private DiagramTransferSrv: DiagramsTransferService
	) {
		this.initDiagram = this.initDiagram.bind(this);
	}

	ngOnInit(): void {
		this.getDiagram();
	}

	public loadJson(json: any): void {
		this.state = produce(this.state, (draft) => {
			draft.diagramNodeData = json.nodeDataArray;
			draft.diagramLinkData = json.linkDataArray;
			draft.diagramModelData = json.modelData;
			draft.skipsDiagramUpdate = false;
		});
	}

	getDiagram() {
		this.DiagramTransferSrv.currentJson.subscribe((data) => {
			if (!data || !data.template_data) {
				console.warn('No hay datos válidos en el servicio');
				return;
			}
			this.saveDiagramLocalStorage(
				data.template_data,
				data.name,
				data.description
			);
		});
		const dataDiagram = localStorage.getItem('currentDiagram');
		if (dataDiagram) {
			const currentDiagram = JSON.parse(dataDiagram);
			this.loadJson(currentDiagram.data);
			this.diagramName = currentDiagram.name;
			this.isLoading = false;
		}
	}

	saveDiagramLocalStorage(data: any, name: any, description: any) {
		const currentDiagram = {
			data: data,
			name: name,
			description: description,
		};
		localStorage.setItem('currentDiagram', JSON.stringify(currentDiagram));
	}

	autosaveDiagram() {
		this.isSaving = true;
		console.log('El diagrama se está autoguardando...');
		let diagramObj: any;

		const diagramJSONString: string = this.diagram.model.toJson();

		try {
			diagramObj = JSON.parse(diagramJSONString);
		} catch (e) {
			console.error('No pude parsear el JSON del diagrama:', e);
			return;
		}

		console.log('diagrama de autosave (objeto):', diagramObj);
		this.saveDiagramLocalStorage(diagramObj, 'name', 'description');
		this.isSaving = false;
		this.isSave = true;
	}

	changeTheme(theme: string) {
		this.theme = theme;
		console.log(this.theme);
		this.diagram.themeManager.currentTheme = theme;
		if (theme === 'dark') {
			this.diagram.grid = new go.Panel('Grid', {
				gridCellSize: new go.Size(10, 10),
			}).add(
				new go.Shape('LineH', { stroke: '#1b1b1b' }),
				new go.Shape('LineV', { stroke: '#1b1b1b' }),
				new go.Shape('LineH', { stroke: '#2a2a2a', interval: 5 }),
				new go.Shape('LineV', { stroke: '#2a2a2a', interval: 5 })
			);
		} else {
			this.diagram.grid = new go.Panel('Grid', {
				gridCellSize: new go.Size(10, 10),
			}).add(
				new go.Shape('LineH', { stroke: '#DAD0CD' }),
				new go.Shape('LineV', { stroke: '#DAD0CD' }),
				new go.Shape('LineH', { stroke: '#C6C1BF', interval: 5 }),
				new go.Shape('LineV', { stroke: '#C6C1BF', interval: 5 })
			);
		}
		this.updateDiagram();
	}

	private updateDiagram(): void {
		this.diagram.startTransaction();
		this.diagram.updateAllRelationshipsFromData();
		this.diagram.updateAllTargetBindings();
		this.diagram.commitTransaction('update');
	}

	public onFileLoaded(json: ModelJson) {
		this.isLoading = true;
		this.diagramJSON = json;

		this.state = produce(this.state, (draft) => {
			draft.diagramNodeData = json.nodeDataArray;
			draft.diagramLinkData = json.linkDataArray;
			draft.diagramModelData = json.modelData;
			draft.skipsDiagramUpdate = false;
		});
		this.cdr.markForCheck();
		setTimeout(() => {
			this.isLoading = false;
		}, 0);
		this.openFile = true;
	}

	public state = {
		diagramNodeData: [] as any,
		diagramLinkData: [] as any,
		diagramModelData: {},
		skipsDiagramUpdate: false,
		selectedNodeData: null,
	};

	public getTemplateNodes = () => {
		const sharedTemplateMap = new go.Map<string, go.Node>();
		sharedTemplateMap.add('TextNode', new TextNode().getNode());
		sharedTemplateMap.add('DiamondNode', new DiamondNode().getNode());
		return sharedTemplateMap;
	};

	public initDiagram() {
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

		this.diagram.themeManager.currentTheme = 'dark';

		this.diagram.themeManager.set('light', {
			colors: {
				text: '#000000',
				arrow: '#000000',
			},
		});
		this.diagram.themeManager.set('dark', {
			colors: {
				text: '#ffffff',
				arrow: '#ffffff',
			},
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

		// Configurar la cuadricula personalizada dependiendo el tema
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
					stroke: null,
				})
					.theme('fill', 'arrow')
					.theme('stroke', 'arrow'),
				new go.Shape({
					toArrow: 'Standard',
					stroke: 'white',
					fill: 'white',
				})
					.theme('fill', 'arrow')
					.theme('stroke', 'arrow')
			);
		return this.diagram;
	}

	public diagramModelChange = (changes: go.IncrementalData) => {
		// Si estamos cargando desde archivo, ignoramos todos los cambios hasta que termine la carga.
		if (this.isLoading) {
			return;
		}

		this.isSaving = true;
		this.isSave = false;
		this.autosaveDiagram();

		// Nos “guardamos” antes los datos sincronizados y le decimos a Angular que, cuando
		// re-renderice, NO vuelva a pasárselos al diagrama (skipsDiagramUpdate = true)
		const appComp = this;
		this.state = produce(this.state, (draft: any) => {
			// IMPORTANTE: indicamos que el siguiente ciclo no debe re-enviar nada al diagrama
			draft.skipsDiagramUpdate = true;

			// Sincronizamos datos con el modelo actual del Diagrama
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

			// Si el nodo seleccionado cambió, actualizamos selectedNodeData
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
		palette.nodeTemplateMap = new NodePalette().getTemplates();
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
			{ category: 'Triangle' },
			{ category: 'DiamondNode', text: 'Texto', color: '#ffffff' },
			{ category: 'Rectangle', text: 'Texto', color: '#ffffff' },
			{ category: 'TextNode', text: 'Texto', color: '#ffffff' },
			{ category: 'Rectangle', text: 'Texto', color: '#ffffff' },
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
				draft.skipsDiagramUpdate = false;
			}
		});
	}
}
