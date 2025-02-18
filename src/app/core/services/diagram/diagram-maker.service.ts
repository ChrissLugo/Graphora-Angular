import { Injectable } from '@angular/core';
import go from 'gojs';
import { Diagram } from '../../models/diagrams/diagram';
import { ClassDiagram } from '../../models/diagrams/ClassDiagram/class-diagram';

// LA FINALIDAD DE ESTE SERVICIO INICIALIZAR DEPENDIENDO EL TIPO DE DIAGRAMA ESCOGIDO

@Injectable({
	providedIn: 'root',
})
export class DiagramMakerService {
	private diagramInstance: Diagram | null = null;

	public inicializarDiagrama(
		type: 'class',
		diagramDiv: HTMLElement,
		paletteDiv: HTMLElement
	): Diagram | null {
		switch (type) {
			case 'class':
				this.diagramInstance = new ClassDiagram(diagramDiv, paletteDiv);
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
