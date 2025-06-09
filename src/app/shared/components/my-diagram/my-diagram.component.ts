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
import { produce } from 'immer';
import { DiamondNode } from '../../../core/models/nodes/diamond-node';
import { initTextEditor } from './extensions/CustomTextEditor';
import { GuidedDraggingTool } from './extensions/GuidedDraggingTool';
import { RotateMultipleTool } from './extensions/RotateMultipleTool';
import { AllPalette } from '../../../core/models/palettes/allPalette';
import { DiagramsTransferService } from '../../../core/services/Data Transfer/DiagramsTransfer.service';
import { UserDiagramsService } from '../../../core/services/API/user/UserDiagrams.service';
import { CircleNode } from '../../../core/models/nodes/circle-node';
import { ContainerNode } from '../../../core/models/nodes/container-node';
import { ActorNode } from '../../../core/models/nodes/actor-node';
import { SidebarPaletteComponent } from '../sidebar-palette/sidebar-palette.component';
import { CUPalette } from '../../../core/models/palettes/CUPalette';
import { FiguresPalette } from '../../../core/models/palettes/figuresPalette';
import { LifeLineNode } from '../../../core/models/nodes/lifeLine-node';
import { SequencePalette } from '../../../core/models/palettes/sequencePalette';
import { ActivityNode } from '../../../core/models/nodes/activity-node';
import { ClassNode } from '../../../core/models/nodes/class-node';
import { ClassPalette } from '../../../core/models/palettes/classPalette';

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
		SidebarPaletteComponent,
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
	public openFile: boolean = false;
	private isLoading: boolean = true;
	private theme = 'dark';
	//Variables Autosave
	public isSave!: boolean;
	public isSaving: boolean = true;
	//datos del diagrama
	public diagramId!: number;
	public diagramName!: string;
	public diagramDescription!: string;
	//datos de la paleta
	public titlePalette: string = 'Sin Título';

	constructor(
		private cdr: ChangeDetectorRef,
		private DiagramTransferSrv: DiagramsTransferService,
		public UserDiagramsSrv: UserDiagramsService
	) {
		this.initDiagram = this.initDiagram.bind(this);
	}

	ngOnInit(): void {
		this.getDiagram();
		this.UserDiagramsSrv.updateDiagram$.subscribe({
			next: () => {
				this.isSaving = false;
				this.isSave = true;
			},
			error: () => {
				this.isSaving = false;
			},
		});
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
			this.diagramId = data.template_id;
			this.diagramName = data.name;
			this.diagramDescription = data.description;
			this.saveDiagramLocalStorage(
				this.diagramId,
				data.template_data,
				this.diagramName,
				this.diagramDescription
			);
		});
		const dataDiagram = this.getDataFromLocalStorage('currentDiagram');
		// localStorage.getItem('currentDiagram');
		if (dataDiagram) {
			// const currentDiagram = JSON.parse(dataDiagram);
			this.loadJson(dataDiagram.data);
			this.diagramName = dataDiagram.name;
			this.diagramId = dataDiagram.id;
			(this.diagramDescription = dataDiagram.description),
				(this.isLoading = false);
		}
	}

	saveDiagramLocalStorage(id: any, data: any, name: any, description: any) {
		const currentDiagram = {
			id: id,
			data: data,
			name: name,
			description: description,
		};
		localStorage.setItem('currentDiagram', JSON.stringify(currentDiagram));
	}

	autosaveDiagram() {
		this.isSaving = true;
		let diagramObj: any;

		const diagramJSONString: string = this.diagram.model.toJson();

		try {
			diagramObj = JSON.parse(diagramJSONString);
		} catch (e) {
			console.error('No pude parsear el JSON del diagrama:', e);
			return;
		}
		//Guardar en el localhost
		this.saveDiagramLocalStorage(
			this.diagramId,
			diagramObj,
			this.diagramName,
			this.diagramDescription
		);

		const dataDiagram = {
			name: this.diagramName,
			description: this.diagramDescription, // (puede ser null)
			// category_id: null, // (por el momento puede ser null)
			template_data: diagramObj, // (este tiene que ser un json)
		};

		//Guardar en la bdd
		this.UserDiagramsSrv.saveDiagram(dataDiagram).subscribe({
			next: () => {
				this.UserDiagramsSrv.currentDiagram = dataDiagram;
				this.isSaving = false;
				this.isSave = true;
			},
			error: () => {
				// this.UserDiagramsSrv.updateDiagram;
				this.UserDiagramsSrv.updateDiagramTime({
					id: this.diagramId,
					data: dataDiagram,
				});
			},
		});
	}

	getDataFromLocalStorage(key: string) {
		const dataDiagram = localStorage.getItem(key);
		let currentDiagram;
		if (dataDiagram) {
			currentDiagram = JSON.parse(dataDiagram);
		}
		return currentDiagram;
	}

	renameFile(newName: string) {
		const diagramData = this.getDataFromLocalStorage('currentDiagram');
		const dataDiagram = {
			name: newName,
			description: this.diagramDescription,
			// category_id: null, // (por el momento puede ser null)
			template_data: diagramData.data,
		};
		this.UserDiagramsSrv.updateDiagramNormal(
			dataDiagram,
			this.diagramId
		).subscribe({
			next: (value) => {
				this.saveDiagramLocalStorage(
					this.diagramId,
					diagramData.data,
					newName,
					this.diagramDescription
				);
			},
			error: (err) => {
				console.log('MOSTRAR ERROR AL RENOMBRAR DIAGRAMA CON SWAY');
			},
		});
	}

	public setPaletteTitle(title: any) {
		this.titlePalette = title;
	}

	changeTheme(theme: string) {
		this.theme = theme;

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

	//Template
	public getTemplateNodes = () => {
		const map = new go.Map<string, go.Node>();
		map.add('TextNode', new TextNode().getNode());
		map.add('DiamondNode', new DiamondNode().getNode());
		map.add('ContainerNode', new ContainerNode().getNode());
		map.add('CircleNode', new CircleNode().getNode());
		map.add('ActorNode', new ActorNode().getNode());
		map.add('ActivityNode', new ActivityNode().getNode());
		map.add('ClassNode', new ClassNode().getNode());

		return map;
	};

	public getGroupTemplates = () => {
		const map = new go.Map<string, go.Group>();
		map.add('LifeLineNode', new LifeLineNode().getNode());
		return map;
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
			'linkingTool.portGravity': 20,
			// 'relinkingTool.portGravity': 0,
			'linkingTool.isUnconnectedLinkValid': true,
			// 'textEditingTool.defaultTextEditor': new CustomTextEditor(),
			// 'linkingTool.portGravity': 0,
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

		this.diagram.toolManager.textEditingTool.defaultTextEditor =
			initTextEditor(window);

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
		this.diagram.groupTemplateMap = this.getGroupTemplates();

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

	//Template
	public allPaletteState!: any;
	public templates!: any;
	public groupTemplate!: any;

	public setPalette(opc: any) {
		console.log('Esta es la opcion de la paleta', opc);
		switch (opc) {
			case 'all':
				this.templates = new AllPalette().getNodeTemplates();
				this.groupTemplate = new AllPalette().getGroupTemplates();
				this.allPaletteState = new AllPalette().getPalette();
				break;
			case 'cu':
				this.templates = new CUPalette().getTemplates();
				this.allPaletteState = new CUPalette().getPalette();
				break;
			case 'figures':
				this.templates = new FiguresPalette().getTemplates();
				this.allPaletteState = new FiguresPalette().getPalette();
				break;
			case 'sequence':
				this.templates = new SequencePalette().getNodeTemplates();
				this.groupTemplate = new SequencePalette().getGroupTemplates();
				this.allPaletteState = new SequencePalette().getPalette();
				break;
			case 'classes':
				this.templates = new ClassPalette().getNodeTemplates();
				this.allPaletteState = new ClassPalette().getPalette();
				break;

			default:
				this.allPaletteState = {
					paletteNodeData: [],
					paletteModelData: { prop: 'val' },
				};
				break;
		}
	}

	public initPalette = (): go.Palette => {
		const $ = go.GraphObject.make;

		const palette = $(go.Palette, {
			nodeTemplateMap: this.templates,
			groupTemplateMap: this.groupTemplate,
			layout: $(go.GridLayout, {
				wrappingColumn: 2, // Número de columnas deseadas
				alignment: go.GridLayout.Position,
				cellSize: new go.Size(1, 1),
				spacing: new go.Size(10, 10),
			}),
			// Opcional: puedes configurar un ancho específico si no estás usando CSS para eso
			// contentAlignment: go.Spot.TopLeft
		});

		return palette;
	};

	public initOverview(): go.Overview {
		return new go.Overview();
	}

	// @param changedPropAndVal
	public handleInspectorChange(changedPropAndVal: any) {
		const path = changedPropAndVal.prop;
		const value = changedPropAndVal.newVal;

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
