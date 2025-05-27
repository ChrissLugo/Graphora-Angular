import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import {
	FaIconLibrary,
	FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
	faChevronDown,
	faFile,
	faFileExport,
	faFileImage,
	faFilePdf,
	faFloppyDisk,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
	selector: 'app-navbar',
	imports: [
		FontAwesomeModule,
		CommonModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatMenuModule,
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css',
})
export class NavbarComponent {
	@Input() fileName!: string;
	@Input() diagram!: go.Diagram;

	constructor(icons: FaIconLibrary) {
		icons.addIcons(
			faChevronDown,
			faFile,
			faFloppyDisk,
			faFileExport,
			faFileImage,
			faFilePdf
		);
	}

	renameFile() {
		throw new Error('Method not implemented.');
	}
	openFromFile() {
		throw new Error('Method not implemented.');
	}
	newFile() {
		throw new Error('Method not implemented.');
	}
	saveAS() {
		const diagramData = this.diagram.model.toJson();
		console.log(diagramData);
	}
	save() {
		const diagramData = this.diagram.model.toJson();
		console.log(diagramData);
	}
	exportPDF() {
		throw new Error('Method not implemented.');
	}

	exportPNG() {
		Swal.fire({
			title: 'Color de fondo',
			input: 'radio',
			inputOptions: {
				white: 'Blanco',
				transparent: 'Transparente',
				black: 'Negro',
			},
			inputValidator: (value) => {
				return new Promise((resolve) => {
					if (value) {
						resolve();
					} else {
						resolve('Elija un color de fondo para continuar');
					}
				});
			},
			confirmButtonColor: '#7204c1',
			confirmButtonText: 'Descargar PNG',
			cancelButtonText: 'Cancelar',
			showCancelButton: true,
			preConfirm: (value) => {
				return value;
			},
		}).then((result) => {
			if (result.isConfirmed) {
				this.diagram.makeImageData({
					background: result.value,
					returnType: 'blob',
					callback: (blob: any) => this.myCallback(blob),
				});
			}
		});
	}

	myCallback(blob: Blob) {
		const filename = 'myDiagram.png';
		if ((window.navigator as any).msSaveOrOpenBlob) {
			(window.navigator as any).msSaveOrOpenBlob(blob, filename);
			return;
		}
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}
}
