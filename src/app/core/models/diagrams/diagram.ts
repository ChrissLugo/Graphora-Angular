import go from 'gojs';
import { TextNode } from '../nodes/text-node';
import { EmptyNode } from '../nodes/empty-node';

export abstract class Diagram {
	protected diagram: go.Diagram;
	protected palette: go.Palette;

	constructor(
		public diagramDiv: HTMLElement,
		public paletteDiv: HTMLElement
	) {
		// Inicializar y configurar el diagrama
		this.diagram = new go.Diagram(diagramDiv, {
			'animationManager.isEnabled': true,
		});
		this.diagram.undoManager.isEnabled = true;
		this.diagram.grid.visible = true;
		this.diagram.toolManager.draggingTool.isGridSnapEnabled = true;
		this.diagram.initialContentAlignment = go.Spot.Center;
		this.diagram.allowLink = true;
		this.diagram.allowRotate = true;

		// Configurar la cuadricula personalizada
		this.diagram.grid = new go.Panel('Grid', {
			gridCellSize: new go.Size(10, 10),
		}).add(
			new go.Shape('LineH', { stroke: '#1b1b1b' }),
			new go.Shape('LineV', { stroke: '#1b1b1b' }),
			new go.Shape('LineH', { stroke: '#2a2a2a', interval: 5 }),
			new go.Shape('LineV', { stroke: '#2a2a2a', interval: 5 })
		);

		// Crear una plantilla común para el diagrama y la paleta
		const nodeTemplate = new go.Node('Auto').add(
			new go.Shape('RoundedRectangle', {
				strokeWidth: 0.5,
			}).bind('fill', 'color'),
			new go.TextBlock({ margin: 8 }).bind('text')
		);

		// Usar la plantilla en el diagrama
		this.diagram.nodeTemplate = nodeTemplate;

		// Inicializar y configurar la paleta
		this.palette = new go.Palette(paletteDiv);
		// Se utiliza la misma plantilla para la paleta...
		this.palette.nodeTemplate = nodeTemplate;

		// Agregar plantillas personalizadas para categorías específicas
		this.palette.nodeTemplateMap.add(
			'TextNode',
			new TextNode().nodoConfig()
		);
		this.palette.nodeTemplateMap.add(
			'EmptyNode',
			new EmptyNode().nodoConfig()
		);
		// También se agregan al mapa de plantillas del diagrama
		this.diagram.nodeTemplateMap.add(
			'TextNode',
			new TextNode().nodoConfig()
		);

		// Agregar nodos iniciales a la paleta (incluyendo algunos de categorías personalizadas)
		this.palette.model = new go.GraphLinksModel([
			{ category: 'EmptyNode' }, // Espacio adicional en la parte superior
			{ category: 'EmptyNode' },
			{ category: 'TextNode' },
			{ text: 'Nodo 2', color: 'lightgreen' },
			{ text: 'Nodo 1', color: 'lightblue' },
			{ text: 'Nodo 2', color: 'lightgreen' },
			{ text: 'Nodo 1', color: 'lightblue' },
			{ text: 'Nodo 2', color: 'lightgreen' },
			{ text: 'Nodo 1', color: 'lightblue' },
			{ text: 'Nodo 2', color: 'lightgreen' },
		]);

		// Llamada a configuración adicional que se definirá en subclases
		this.configureDiagram();
	}

	// Método abstracto para que las subclases puedan configurar el diagrama adicionalmente
	protected abstract configureDiagram(): void;

	public getDiagram(): go.Diagram {
		return this.diagram;
	}
}
