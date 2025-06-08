import * as go from 'gojs';

export class ActivityNode {
	LinePrefix: number = 20; // vertical starting point in document for all Messages and Activations
	LineSuffix = 30; // vertical length beyond the last message time
	MessageSpacing = 20; // vertical distance between Messages at different steps
	ActivityWidth = 10; // width of each vertical activity bar
	ActivityStart = 5; // height before start message time
	ActivityEnd = 5; // height beyond end message time
	protected node: go.Node;

	constructor(private diagram: go.Diagram) {
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

		this.node = new go.Node({
			locationSpot: go.Spot.Top,
			locationObjectName: 'SHAPE',
			// minLocation: new go.Point(
			// 	NaN,
			// 	this.LinePrefix - this.ActivityStart
			// ),
			// maxLocation: new go.Point(NaN, 19999),
			selectionObjectName: 'SHAPE',
			selectable: true,
			selectionAdornmentTemplate: nodeSelectionAdornmentTemplate,
			rotatable: true,
			rotateAdornmentTemplate: nodeRotateAdornmentTemplate,
			resizable: true,
			resizeObjectName: 'PANEL',
			fromLinkable: true,
			toLinkable: true,
			resizeAdornmentTemplate: new go.Adornment('Spot').add(
				new go.Placeholder(),
				new go.Shape({
					// only a bottom resize handle
					alignment: go.Spot.Bottom,
					cursor: 'col-resize',
					desiredSize: new go.Size(6, 6),
					fill: '#9710fa',
				})
			),
		})
			.bindTwoWay('location', 'loc', go.Point.parse, go.Point.stringify)
			.bindTwoWay('angle')
			// .bindTwoWay(
			// 	'location',
			// 	'',
			// 	this.computeActivityLocation,
			// 	this.backComputeActivityLocation
			// )
			.add(
				new go.Shape('Rectangle', {
					name: 'SHAPE',
					fill: 'white',
					stroke: 'black',
					width: this.ActivityWidth,
					// allow Activities to be resized down to 1/4 of a time unit
					minSize: new go.Size(
						this.ActivityWidth,
						this.computeActivityHeight(0.25)
					),
					mouseEnter: (e, node) => showSmallPorts(node, true),
					mouseLeave: (e, node) => showSmallPorts(node, false),
				}),
				// .bindTwoWay(
				// 'height',
				// 'duration',
				// this.computeActivityHeight,
				// this.backComputeActivityHeight
				// )
				makePort('T', go.Spot.Top, true, true),
				makePort('L', go.Spot.Left, true, true),
				makePort('R', go.Spot.Right, true, true),
				makePort('B', go.Spot.Bottom, true, true)
			);

		function showSmallPorts(node: any, show: any) {
			node.ports.each((port: any) => {
				if (port.portId !== '') {
					port.fill = show ? 'rgba(255,255,255,.6)' : null;
				}
			});
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
	computeActivityLocation(act: any) {
		const groupdata = this.diagram.model.findNodeDataForKey(act.group);
		if (groupdata === null) return new go.Point();
		// get location of Lifeline's starting point
		const grouploc = go.Point.parse(groupdata['loc']);
		return new go.Point(
			grouploc.x,
			this.convertTimeToY(act.start) - this.ActivityStart
		);
	}
	backComputeActivityHeight(height: any) {
		return (
			(height - this.ActivityStart - this.ActivityEnd) /
			this.MessageSpacing
		);
	}
	backComputeActivityLocation(loc: any, act: any) {
		this.diagram.model.setDataProperty(
			act,
			'start',
			this.convertYToTime(loc.y + this.ActivityStart)
		);
	}
	computeActivityHeight(duration: any) {
		return (
			this.ActivityStart +
			duration * this.MessageSpacing +
			this.ActivityEnd
		);
	}

	convertTimeToY(t: any) {
		return t * this.MessageSpacing + this.LinePrefix;
	}
	convertYToTime(y: any) {
		return (y - this.LinePrefix) / this.MessageSpacing;
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
