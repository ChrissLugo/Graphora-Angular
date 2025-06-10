import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
	FaIconLibrary,
	FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-sidebar-palette',
	imports: [CommonModule, FontAwesomeModule],
	templateUrl: './sidebar-palette.component.html',
	styleUrl: './sidebar-palette.component.css',
})
export class SidebarPaletteComponent implements OnInit {
	public opc!: string;
	@Output() option = new EventEmitter<string>();
	@Output() title = new EventEmitter<string>();
	@Output() hiddePalette = new EventEmitter<boolean>();

	constructor(icons: FaIconLibrary) {
		icons.addIcons(faX);
	}

	handlePalette() {
		this.hiddePalette.emit(true);
	}

	ngOnInit(): void {
		//Carga la opc por defecto
		this.option.emit('all');
		this.title.emit('Todas las Figuras');
		this.opc = 'all';
	}

	public handleOption(opc: string, title: string) {
		this.option.emit(opc);
		this.title.emit(title);
		this.opc = opc;
	}
}
