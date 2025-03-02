import { Injectable } from '@angular/core';
import go from 'gojs';
import { BaseDiagram } from '../../models/diagrams/diagram';
import { ClassDiagram } from '../../models/diagrams/ClassDiagram/class-diagram';
import { FlowDiagram } from '../../models/diagrams/ClassDiagram/flow-diagram';

// LA FINALIDAD DE ESTE SERVICIO INICIALIZAR DEPENDIENDO EL TIPO DE DIAGRAMA ESCOGIDO

@Injectable({
	providedIn: 'root',
})
export class DiagramMakerService {
	private diagramInstance: BaseDiagram | null = null;

	public inicializarDiagrama(type: string | null): BaseDiagram | null {
		switch (type) {
			case 'class':
				this.diagramInstance = new ClassDiagram();
				this.diagramInstance;
				break;
			case 'flow':
				this.diagramInstance = new FlowDiagram();
				break;

			default:
				break;
		}

		return this.diagramInstance;
	}

	// public updateModel(nodeDataArray: any[], linkDataArray: any[]): void {
	// 	if (!this.diagramInstance) return;
	// 	this.diagramInstance.updateModel(nodeDataArray, linkDataArray);
	// }
}
