import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
	FaIconLibrary,
	FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
	faChevronDown,
	faCircleCheck,
	faCircleXmark,
	faCloud,
	faFile,
	faFileExport,
	faFileImage,
	faFilePdf,
	faFloppyDisk,
	faShareFromSquare,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import go from 'gojs';

interface ModelJson {
	modelData: any;
	nodeDataArray: any[];
	linkDataArray: any[];
}

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
	@Input() fileName!: string | null;
	@Input() diagram!: go.Diagram;
	@Input() hasChanges!: boolean;
	@Output() hasChangesChange = new EventEmitter<any>();
	@Output() fileLoaded = new EventEmitter<any>();

	constructor(icons: FaIconLibrary) {
		icons.addIcons(
			faChevronDown,
			faFile,
			faFloppyDisk,
			faFileExport,
			faFileImage,
			faFilePdf,
			faCloud,
			faCircleCheck,
			faCircleXmark,
			faSpinner,
			faShareFromSquare
		);
	}

	public renameFile(): void {
		Swal.fire({
			title: 'Renombrar archivo',
			input: 'text',
			inputValue: this.fileName || '',
			showCancelButton: true,
			confirmButtonText: 'Renombrar',
			cancelButtonText: 'Cancelar',
			theme: 'dark',
			preConfirm: (value) => {
				if (!value) {
					Swal.showValidationMessage(
						'El nombre no puede estar vacío'
					);
				}
				return value;
			},
		}).then((result) => {
			if (result.isConfirmed && result.value) {
				this.fileName = result.value;
			}
		});
	}

	public getJSONFromFile(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) {
			return;
		}

		const file = input.files[0];
		this.fileName = file.name;

		const reader = new FileReader();
		reader.onload = () => {
			const textRaw = reader.result as string;
			const text = textRaw.replace(/^\uFEFF/, '');

			try {
				const parsed = JSON.parse(text) as ModelJson;
				this.fileLoaded.emit(parsed);

				this.hasChanges = false;
				this.hasChangesChange.emit(false);
			} catch (err) {
				Swal.fire({
					title: 'JSON inválido',
					text: 'El contenido del archivo no es un JSON bien formado.',
					icon: 'error',
					theme: 'dark',
				});
			}
		};
		reader.onerror = (evt) => {
			console.error('FileReader onerror:', evt);
			Swal.fire({
				title: 'Error leyendo archivo',
				text: 'Ocurrió un problema al leer el archivo seleccionado.',
				icon: 'error',
				theme: 'dark',
			});
		};
		reader.readAsText(file);
	}

	public openFromFile(): void {
		const inputEl = document.createElement('input');
		inputEl.type = 'file';
		inputEl.accept = 'application/json';
		inputEl.onchange = (e) => this.getJSONFromFile(e as any);
		inputEl.click();
	}

	public newFile(): void {
		Swal.fire({
			title: '¿Crear diagrama nuevo?',
			text: 'Si continúas, se perderán los cambios no guardados.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, crear nuevo',
			cancelButtonText: 'Cancelar',
			theme: 'dark',
		}).then((result) => {
			if (result.isConfirmed) {
				this.fileName = null;
				this.hasChanges = false;
				this.hasChangesChange.emit(false);
				this.fileLoaded.emit({
					modelData: {},
					nodeDataArray: [],
					linkDataArray: [],
				});
			}
		});
	}

	public save(): void {}

	public exportJSON(): void {
		const diagramJSON = this.diagram.model.toJson();
		const blob = new Blob([diagramJSON], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = this.fileName || 'mi-diagrama.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		this.hasChanges = false;
		this.hasChangesChange.emit(false);
	}

	exportPDF() {
		throw new Error('Method not implemented.');
	}

	exportSVG() {
		throw new Error('Method not implemented.');
	}

	exportPNG() {
		Swal.fire({
			title: 'Color de fondo',
			theme: 'dark',
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
					callback: (blob: any) => this.saveImage(blob, 'png'),
				});
			}
		});
	}

	private saveImage(blob: Blob, type: string) {
		const extension = type.toLowerCase();
		const filename = `diagrama.${extension}`;

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
