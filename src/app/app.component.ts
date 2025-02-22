import { Component } from '@angular/core';
import { AlertDemoComponent } from './alert-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AlertDemoComponent],
  template: `
    <h1 class="text-center text-2xl font-bold p-4">Prueba de Alertas</h1>
    <app-alert-demo></app-alert-demo>
  `,
})
export class AppComponent {}
