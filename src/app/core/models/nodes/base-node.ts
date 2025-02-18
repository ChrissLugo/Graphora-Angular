import go from 'gojs';

export abstract class BaseNode {
	protected node: go.Node;
	constructor() {
		this.node = new go.Node('Auto', {
			resizable: true,
		});
		this.nodoConfig();
	}

	abstract nodoConfig(): go.Node;
}
