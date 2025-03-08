import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import * as go from 'gojs';
import {
	DiagramComponent,
	OverviewComponent,
	PaletteComponent,
} from 'gojs-angular';
import { TextNode } from '../../../core/models/nodes/text-node';
import { EmptyNode } from '../../../core/models/nodes/empty-node';
import { DiagramMakerService } from '../../../core/services/diagram/diagram-maker.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-my-diagram',
	imports: [
		NavbarComponent,
		DiagramComponent,
		PaletteComponent,
		OverviewComponent,
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
	//SE PASARA DESDE LA CONFIGURACION DEL TIPO DE DIAGRAMA
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

	public ngAfterViewInit() {
		if (this.observedDiagram) return;
		this.observedDiagram = this.myDiagramComponent.diagram;
		this.cdr.detectChanges();
	}

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

			{ category: 'TextNode' },
			{ category: 'TextNode' },
		],
		paletteModelData: { prop: 'val' },
	};

	public getTemplateNodes = () => {
		const sharedTemplateMap = new go.Map<string, go.Node>();
		sharedTemplateMap.add('TextNode', new TextNode().nodoConfig());
		sharedTemplateMap.add('EmptyNode', new EmptyNode().nodoConfig());

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

	// TO-DO
	// - VERIFICAR QUE CADA TIPO DIAGRAMA TENGA SU STATE Y SE PUEDA OBTENER AQUI
	// x ERROR CON LOS NODOS VACIOS EN LA PALETA, TIENE RESPOSIVE Y SE ACOMODAN MAL
	// - HACER EL INSPECTOR
	// - REFACTORIZAR CÓDIGO
}
