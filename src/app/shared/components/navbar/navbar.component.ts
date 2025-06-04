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
import jsPDF from 'jspdf';

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
	@Input() diagramName: string | null = 'Nuevo Documento';
	@Input() diagram!: go.Diagram;
	@Output() fileLoaded = new EventEmitter<any>();
	@Output() typeTheme = new EventEmitter<string>();
	@Input() isSave: boolean = false;
	@Input() isSaving: boolean = true;

	public theme = 'dark';

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

	changeTheme() {
		if (this.theme == 'light') {
			this.theme = 'dark';
			this.typeTheme.emit('dark');
			document.querySelector('html')?.classList.add('dark');
		} else {
			this.theme = 'light';
			this.typeTheme.emit('light');
			document.querySelector('html')?.classList.remove('dark');
		}
	}

	public renameFile(): void {
		Swal.fire({
			title: 'Renombrar archivo',
			input: 'text',
			inputValue: this.diagramName || '',
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
				this.diagramName = result.value;
			}
		});
	}

	public getJSONFromFile(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) {
			return;
		}

		const file = input.files[0];
		this.diagramName = file.name;

		const reader = new FileReader();
		reader.onload = () => {
			const textRaw = reader.result as string;
			const text = textRaw.replace(/^\uFEFF/, '');

			try {
				const parsed = JSON.parse(text) as ModelJson;
				this.fileLoaded.emit(parsed);
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
				this.diagramName = null;
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
		a.download = this.diagramName || 'mi-diagrama.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	public makePDF(background: 'black' | 'white' | 'transparent') {
		const svgElement = this.diagram.makeSvg({
			scale: 1,
			background: background,
		});
		const svgString = new XMLSerializer().serializeToString(svgElement!);
		const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.onload = () => {
			const origWidth = img.width;
			const origHeight = img.height;

			// 3) Crear canvas de alta resolución para el diagrama (scaleFactor = 2)
			const scaleFactor = 2;
			const canvas = document.createElement('canvas');
			canvas.width = origWidth * scaleFactor;
			canvas.height = origHeight * scaleFactor;
			const ctx = canvas.getContext('2d')!;
			ctx.scale(scaleFactor, scaleFactor);
			ctx.drawImage(img, 0, 0);

			const imgData = canvas.toDataURL('image/png'); // PNG de alta resolución

			// 4) Crear PDF del tamaño exacto del diagrama
			const pdf = new jsPDF({
				unit: 'px',
				format: [origWidth, origHeight],
				orientation: origWidth > origHeight ? 'landscape' : 'portrait',
			});

			// 5) Dibujar el PNG a tamaño completo (0,0) sin márgenes
			pdf.addImage(imgData, 'PNG', 0, 0, origWidth, origHeight);

			const baseName = (this.diagramName || 'diagrama').replace(
				/\.json$/i,
				''
			);
			pdf.save(`${baseName}.pdf`);

			URL.revokeObjectURL(url);
		};

		img.onerror = () => {
			Swal.fire({
				title: 'Error al generar PDF',
				text: 'Ocurrió un problema al convertir el diagrama a PDF.',
				icon: 'error',
				theme: 'dark',
			});
			URL.revokeObjectURL(url);
		};

		img.src = url;
	}

	public exportPNG_SVG_PDF(type: 'png' | 'svg' | 'pdf') {
		const opcionesFondo: Record<string, string> = {
			white: 'Blanco',
			black: 'Negro',
		};
		if (type !== 'pdf') {
			opcionesFondo['transparent'] = 'Transparente';
		}

		Swal.fire({
			title: 'Color de fondo',
			theme: 'dark',
			input: 'radio',
			inputOptions: opcionesFondo,
			inputValidator: (value) => {
				return new Promise((resolve) => {
					if (value) resolve();
					else resolve('Elija un color de fondo para continuar');
				});
			},
			confirmButtonColor: '#7204c1',
			confirmButtonText: `Descargar ${type.toUpperCase()}`,
			cancelButtonText: 'Cancelar',
			showCancelButton: true,
			preConfirm: (value) => value,
		}).then((result) => {
			if (!result.isConfirmed) return;
			const nuevoFondo = result.value as
				| 'white'
				| 'black'
				| 'transparent';

			this.diagram.startTransaction('CambioTemaParaExport');
			if (nuevoFondo === 'black') {
				this.diagram.themeManager.currentTheme = 'dark';
			} else {
				this.diagram.themeManager.currentTheme = 'light';
			}
			this.diagram.updateAllTargetBindings();
			this.diagram.commitTransaction('CambioTemaParaExport');
			if (type === 'png') {
				this.diagram.makeImageData({
					background: nuevoFondo,
					returnType: 'blob',
					callback: (blob: Blob) => {
						this.makePNG_SVG(blob, 'png');
						this.diagram.startTransaction('RestaurarTemaOriginal');
						this.diagram.themeManager.currentTheme = this.theme;
						this.diagram.updateAllTargetBindings();
						this.diagram.commitTransaction('RestaurarTemaOriginal');
					},
				});
			} else if (type === 'svg') {
				const svg = this.diagram.makeSvg({
					scale: 1,
					background: nuevoFondo,
				});
				const svgStr = new XMLSerializer().serializeToString(svg!);
				const blob = new Blob([svgStr], { type: 'image/svg+xml' });
				this.makePNG_SVG(blob, 'svg');
				this.diagram.startTransaction('RestaurarTemaOriginal');
				this.diagram.themeManager.currentTheme = this.theme;
				this.diagram.updateAllTargetBindings();
				this.diagram.commitTransaction('RestaurarTemaOriginal');
			} else {
				// PDF
				this.makePDF(nuevoFondo);
				this.diagram.startTransaction('RestaurarTemaOriginal');
				this.diagram.themeManager.currentTheme = this.theme;
				this.diagram.updateAllTargetBindings();
				this.diagram.commitTransaction('RestaurarTemaOriginal');
			}
		});
	}

	private makePNG_SVG(blob: Blob, type: 'png' | 'svg') {
		const filename = `diagrama.${type}`;

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
