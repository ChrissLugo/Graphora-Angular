import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-sidebar-palette',
	imports: [CommonModule],
	templateUrl: './sidebar-palette.component.html',
	styleUrl: './sidebar-palette.component.css',
})
export class SidebarPaletteComponent implements OnInit {
	public opc!: string;
	@Output() option = new EventEmitter<string>();
	@Output() title = new EventEmitter<string>();

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
