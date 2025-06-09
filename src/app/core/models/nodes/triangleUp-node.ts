import * as go from 'gojs';

export class TriangleUpNode {
	protected node: go.Node;
	constructor() {
		function makePort(name: any, spot: any, output: any, input: any) {
			return new go.Shape('Circle', {
				fill: null,
				stroke: null,
				desiredSize: new go.Size(7, 7),
				alignment: spot,
				alignmentFocus: spot,
				portId: name,
				fromSpot: spot,
				toSpot: spot,
				fromLinkable: output,
				toLinkable: input,
				cursor: 'pointer',
			});
		}

		var nodeSelectionAdornmentTemplate = new go.Adornment('Auto').add(
			new go.Shape({
				fill: null,
				stroke: '#9710fa',
				strokeWidth: 1.5,
				strokeDashArray: [4, 2],
			}),
			new go.Placeholder()
		);

		var nodeResizeAdornmentTemplate = new go.Adornment('Spot', {
			locationSpot: go.Spot.Right,
		}).add(
			new go.Placeholder(),
			new go.Shape({
				alignment: go.Spot.TopLeft,
				cursor: 'nw-resize',
				desiredSize: new go.Size(6, 6),
				fill: '#7204c1',
				stroke: '#9710fa',
			}),
			new go.Shape({
				alignment: go.Spot.Top,
				cursor: 'n-resize',
				desiredSize: new go.Size(6, 6),
				fill: '#7204c1',
				stroke: '#9710fa',
			}),
			new go.Shape({
				alignment: go.Spot.TopRight,
				cursor: 'ne-resize',
				desiredSize: new go.Size(6, 6),
				fill: '#7204c1',
				stroke: '#9710fa',
			}),
			new go.Shape({
				alignment: go.Spot.Left,
				cursor: 'w-resize',
				desiredSize: new go.Size(6, 6),
				fill: '#7204c1',
				stroke: '#9710fa',
			}),
			new go.Shape({
				alignment: go.Spot.Right,
				cursor: 'e-resize',
				desiredSize: new go.Size(6, 6),
				fill: '#7204c1',
				stroke: '#9710fa',
			}),
			new go.Shape({
				alignment: go.Spot.BottomLeft,
				cursor: 'se-resize',
				desiredSize: new go.Size(6, 6),
				fill: '#7204c1',
				stroke: '#9710fa',
			}),
			new go.Shape({
				alignment: go.Spot.Bottom,
				cursor: 's-resize',
				desiredSize: new go.Size(6, 6),
				fill: '#7204c1',
				stroke: '#9710fa',
			}),
			new go.Shape({
				alignment: go.Spot.BottomRight,
				cursor: 'sw-resize',
				desiredSize: new go.Size(6, 6),
				fill: '#7204c1',
				stroke: '#9710fa',
			})
		);

		var nodeRotateAdornmentTemplate = new go.Adornment({
			locationSpot: go.Spot.Center,
			locationObjectName: 'ELLIPSE',
		}).add(
			new go.Shape('Ellipse', {
				name: 'ELLIPSE',
				cursor: 'pointer',
				desiredSize: new go.Size(7, 7),
				fill: '#7204c1',
				stroke: '#9710fa',
			})
		);

		this.node = new go.Node('Auto', {
			locationSpot: go.Spot.Center,
			rotatable: true,
			rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
			resizable: true,
			resizeObjectName: 'PANEL',
			resizeAdornmentTemplate: nodeResizeAdornmentTemplate,
			selectable: true,
			selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
			mouseEnter: (e, node) => showSmallPorts(node, true),
			mouseLeave: (e, node) => showSmallPorts(node, false),
		})
			.bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
			.bindTwoWay('angle');
		this.node.add(
			new go.Shape('TriangleUp', {
				fill: 'transparent',
				stroke: 'pink',
				name: 'PANEL',
				minSize: new go.Size(80, 80),
				strokeWidth: 5,
			}),
			new go.TextBlock({
				margin: 8,
				editable: true,
				isMultiline: true,
			})
				.bind(new go.Binding('text', 'text').makeTwoWay())
				.bind(
					new go.Binding(
						'stroke',
						'',
						(_: any, tb: go.GraphObject) => {
							const data =
								(tb.part && tb.part.data) || ({} as any);
							const userColor = (data.color || '')
								.toString()
								.toLowerCase();
							if (
								userColor !== '#000' &&
								userColor !== '#000000' &&
								userColor !== '#fff' &&
								userColor !== '#ffffff'
							) {
								return data.color;
							}
							const textBgHex =
								(data.textBgColor as string) || '';
							if (textBgHex) {
								return isColorLight(textBgHex)
									? '#000000'
									: '#FFFFFF';
							}
							const shapeBgHex =
								(data.shapeBgColor as string) || '';
							if (shapeBgHex) {
								return isColorLight(shapeBgHex)
									? '#000000'
									: '#FFFFFF';
							}
							if (tb.diagram) {
								return tb.diagram.themeManager.findValue(
									'text',
									'colors'
								);
							}
							return '#000000';
						}
					).makeTwoWay()
				)
				.bind(new go.Binding('text', 'text').makeTwoWay())
				.bind(new go.Binding('background', 'textBgColor').makeTwoWay())
				.bind(new go.Binding('font', 'font').makeTwoWay())
				.bind(new go.Binding('alignment', 'alignment').makeTwoWay()),
			makePort('T', go.Spot.Top, true, true),
			makePort('L', go.Spot.Left, true, true),
			makePort('R', go.Spot.Right, true, true),
			makePort('B', go.Spot.Bottom, true, true)
		);

		const shape = this.node.findObject('PANEL');
		if (shape) {
			shape.bind(new go.Binding('stroke', 'borderColor').makeTwoWay());
			shape.bind(
				new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(
					go.Size.stringify
				)
			);
			shape.bind(
				new go.Binding('strokeWidth', 'borderWidth', (val) =>
					Number(val)
				).makeTwoWay()
			);
			shape.bind(
				new go.Binding('strokeDashArray', 'borderStyle').makeTwoWay()
			);
			shape.bind(new go.Binding('fill', 'shapeBgColor').makeTwoWay());
		}

		function isColorLight(hexColor: string): boolean {
			let hex = hexColor.replace(/^#/, '').toLowerCase();

			if (hex.length === 3) {
				hex = hex
					.split('')
					.map((ch) => ch + ch)
					.join('');
			}
			if (hex.length !== 6) {
				return true;
			}

			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);

			const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

			return luminance > 186;
		}

		function showSmallPorts(node: any, show: any) {
			node.ports.each((port: any) => {
				if (port.portId !== '') {
					port.fill = show ? 'rgba(255,255,255,.6)' : null;
				}
			});
		}
	}

	public getNode() {
		return this.node;
	}
}
