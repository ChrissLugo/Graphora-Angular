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
// import { EmptyNode } from '../../../core/models/nodes/empty-node';
import { DiagramMakerService } from '../../../core/services/diagram/diagram-maker.service';
import { ActivatedRoute } from '@angular/router';
// import { StartNodeFlow } from '../../../core/models/nodes/start-node-flow';
import { InspectorComponent } from '../../../core/models/inspector/inspector.component';
import { CommonModule } from '@angular/common';
import { produce } from 'immer';
import { EmptyNode } from '../../../core/models/nodes/empty-node';
import { DiamondNode } from '../../../core/models/nodes/diamond-node';

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

	private diagramtype: string | null = '';
	private diagramInstance!: go.Diagram;
	public observedDiagram: any = null;
	public state: any;

	constructor(
		private diagramMakerService: DiagramMakerService,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef
	) {
		this.initDiagram = this.initDiagram.bind(this);

		//Recuperamos el parametro del tipo de diagrama
		this.route.paramMap.subscribe((params) => {
			this.diagramtype = params.get('type');
			// console.log(this.diagramtype);
		});

		this.diagramInstance = this.getDiagramType();
		this.state = this.getState();
	}

	// currently selected node; for inspector
	public selectedNodeData!: go.ObjectData;

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
	} // end ngAfterViewInit

	private getDiagramType(): go.Diagram {
		const diagram = this.diagramMakerService.inicializarDiagrama(
			this.diagramtype
		);
		if (!diagram) return new go.Diagram();
		return diagram.getDiagram();
	}

	private getState(): any {
		const diagram = this.diagramMakerService.inicializarDiagrama(
			this.diagramtype
		);
		if (!diagram) return new go.Diagram();
		return diagram.getState();
	}

	public allPaletteState = {
		// Palette state props
		paletteNodeData: [
			{ category: 'EmptyNode' }, // Espacio adicional en la parte superior
			{ category: 'EmptyNode' },

			{ key: 1, category: 'TextNode', text: 'Texto', color: '#fff' },
			{ key: 2, category: 'DiamondNode', text: 'Texto', color: '#fff' },
		],
		paletteModelData: { prop: 'val' },
	};

	public getTemplateNodes = () => {
		const sharedTemplateMap = new go.Map<string, go.Node>();
		sharedTemplateMap.add('EmptyNode', new EmptyNode().getNode());
		sharedTemplateMap.add('TextNode', new TextNode().getNode());

		sharedTemplateMap.add('DiamondNode', new DiamondNode().getNode());
		return sharedTemplateMap;
	};

	public initDiagram = (): go.Diagram => {
		if (!this.diagramInstance) return new go.Diagram();
		this.diagramInstance.nodeTemplateMap = this.getTemplateNodes();
		return this.diagramInstance;
	};

	public initPalette = (): go.Palette => {
		const palette = new go.Palette();

		//Se asigna la plantilla de los nodos
		palette.nodeTemplateMap = this.getTemplateNodes();

		return palette;
	};

	public initOverview(): go.Overview {
		return new go.Overview();
	}

	/**
	 * Update a node's data based on some change to an inspector row's input
	 * @param changedPropAndVal An object with 2 entries: "prop" (the node data prop changed), and "newVal" (the value the user entered in the inspector <input>)
	 */
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

	// TO-DO
	// x VERIFICAR QUE CADA TIPO DIAGRAMA TENGA SU STATE Y SE PUEDA OBTENER AQUI
	// x ERROR CON LOS NODOS VACIOS EN LA PALETA, TIENE RESPOSIVE Y SE ACOMODAN MAL
	// x HACER EL INSPECTOR
	// ERROR: al haber un nodo ya en la plantilla y modificar otro este se cicla y se rompe, se empieza a multiplicar el nodo que ha existia en la plantilla
	// - REFACTORIZAR CÓDIGO
}
