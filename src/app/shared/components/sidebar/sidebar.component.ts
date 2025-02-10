import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  selectedFilter: string = '';
  user: any;
  notification!: boolean;

  constructor(private router: Router) {
    this.selectedFilter = this.router.url.replace(/\//g, '');
  }

  // Metodo para actualizar los datos del usuario en el sidebar
  getUserData(): void {
    // this.dataUserService.getUserData().subscribe({
    //   next: (data) => {
    //     if (data.image && !data.image.startsWith('blob:')) {
    //       const blob = this.base64ToBlob(data.image, 'image/jpeg');
    //       data.image = URL.createObjectURL(blob);
    //     }
    //     this.user = data; // Solo un usuario
    //     //console.log('User data with image converted:', this.user);
    //   },
    //   error: (error) => console.error('Error fetching user data:', error),
    // });
  }

  selected(selected: string, ruta: string) {
    this.selectedFilter = selected;
    this.router.navigate([ruta]);
  }

  logout(): void {
    // this.authService.logout();
  }
}
