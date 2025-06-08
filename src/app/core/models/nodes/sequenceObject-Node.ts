import * as go from 'gojs';

export class LifeLineNode {
	LinePrefix: number = 20; // vertical starting point in document for all Messages and Activations
	LineSuffix = 30; // vertical length beyond the last message time
	MessageSpacing = 20; // vertical distance between Messages at different steps
	ActivityWidth = 10; // width of each vertical activity bar
	ActivityStart = 5; // height before start message time
	ActivityEnd = 5; // height beyond end message time
	protected node: go.Group;

	constructor() {
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
		this.node = new go.Group('Vertical', {
			locationSpot: go.Spot.Bottom,
			locationObjectName: 'HEADER',
			// minLocation: new go.Point(0, 0),
			// maxLocation: new go.Point(9999, 0),
			selectionObjectName: 'HEADER',
			rotatable: true,
			rotateAdornmentTemplate: nodeRotateAdornmentTemplate,

			resizable: true,
			resizeObjectName: 'PANEL',
			resizeAdornmentTemplate: nodeResizeAdornmentTemplate,

			selectable: true,
			selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
		})
			.bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
			.add(
				new go.Panel('Auto', { name: 'HEADER' }).add(
					new go.Shape('Rectangle', {
						name: 'PANEL',

						// fill: new go.Brush('Linear', {
						// 	0: '#bbdefb',
						// 	1: go.Brush.darkenBy('#bbdefb', 0.1),
						// }),
						minSize: new go.Size(150, 50),
						strokeWidth: 4,
						fill: 'transparent',
						stroke: '#ffffff',
					}).theme('stroke', 'arrow'),
					new go.TextBlock('Texto', {
						name: 'TEXTBLOCK',
						font: 'bold 10pt sans-serif',
						editable: false,
						isMultiline: true,
						margin: 8,
					})
						.bind(new go.Binding('text', 'text').makeTwoWay())
						.bind(
							new go.Binding(
								'stroke',
								'',
								(_: any, tb: go.GraphObject) => {
									const data =
										(tb.part && tb.part.data) ||
										({} as any);
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
						.bind(
							new go.Binding(
								'background',
								'textBgColor'
							).makeTwoWay()
						)
						.bind(new go.Binding('font', 'font').makeTwoWay())
						.bind(
							new go.Binding(
								'alignment',
								'alignment'
							).makeTwoWay()
						)
				),
				new go.Shape({
					figure: 'LineV',
					fill: null,
					stroke: 'gray',
					strokeDashArray: [4, 4],
					width: 4,
					height: 300,
					strokeWidth: 4,
					alignment: go.Spot.Center,
					portId: '',
					fromLinkable: true,
					fromLinkableDuplicates: true,
					toLinkable: true,
					toLinkableDuplicates: true,
					cursor: 'pointer',
				}).bind('height', 'duration', this.computeLifelineHeight)
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
	}
	computeLifelineHeight(duration: any) {
		return (
			this.LinePrefix + duration * this.MessageSpacing + this.LineSuffix
		);
	}

	public getNode() {
		return this.node;
	}
}
