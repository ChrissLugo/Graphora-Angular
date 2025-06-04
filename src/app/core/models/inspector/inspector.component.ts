import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as go from 'gojs';
import { CommonModule } from '@angular/common';
import { InspectorRowComponent } from './inspector-row.component';
import {
	Font,
	FontInterface,
	FontPickerComponent,
	FontPickerDirective,
} from 'ngx-font-picker';
import {
	FaIconLibrary,
	FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
	faAlignCenter,
	faAlignLeft,
	faAlignRight,
	faEyeDropper,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-inspector',
	imports: [
		CommonModule,
		FontPickerDirective,
		FontAwesomeModule,
		FormsModule,
	],
	templateUrl: './inspector.component.html',
	styleUrl: './inspector.component.css',
})
export class InspectorComponent {
	@Input()
	public nodeData!: go.ObjectData;

	public font!: Font;

	constructor(library: FaIconLibrary) {
		library.addIcons(
			faAlignRight,
			faAlignCenter,
			faAlignLeft,
			faEyeDropper
		);
	}

	stringify(value: any): string {
		return JSON.stringify(value);
	}
	ngOnInit(): void {
		console.log('data enviada', this.nodeData);
		console.log(
			'dataa',
			this.nodeData['borderStyle'],
			'asdfasdf',
			this.stringify(this.nodeData['borderStyle'])
		);
	}

	alignmentText(position: string) {
		let positionFinal;
		switch (position) {
			case 'left':
				positionFinal = go.Spot.Left;
				break;
			case 'center':
				positionFinal = go.Spot.Center;
				break;
			case 'right':
				positionFinal = go.Spot.Right;
				break;

			default:
				break;
		}
		const obj = {
			prop: 'alignment',
			newVal: positionFinal,
		};
		this.onInspectorChange.emit(obj);
	}

	getFontCssString(font: FontInterface): string {
		const size = font.size || '14px';
		const style = font.style && font.style !== 'regular' ? font.style : '';
		return `${style} ${size} ${font.family}`.trim();
	}

	onBorderStyleChange(e: any) {
		let array: number[];
		try {
			array = JSON.parse(e.target.value);
		} catch {
			array = e.target.value;
		}
		const obj = {
			prop: e.target.id,
			newVal: array,
		};
		console.log(
			'Valor en la funcion onBorderStyleChange ',
			array.toString()
		);

		this.onInspectorChange.emit(obj);
	}

	fontpicker = () => {
		const obj = {
			prop: 'font',
			newVal: this.getFontCssString(this.font),
		};
		this.onInspectorChange.emit(obj);
	};

	@Output()
	public onInspectorChange: EventEmitter<any> = new EventEmitter<any>();

	public onInputChangee(e: any) {
		const obj = {
			prop: e.target.id,
			newVal: e.target.value,
		};
		this.onInspectorChange.emit(obj);
	}

	// public onInputChange(propAndValObj: any) {
	// 	this.onInspectorChange.emit(propAndValObj);
	// }
}
