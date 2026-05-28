import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAnchor } from "@angular/material/button";
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-home-component',
  imports: [MatProgressSpinnerModule, MatCardModule, MatToolbarModule,
    MatIconModule, MatAnchor, MatSidenavModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  loading = signal(false);
  sidebarOpen = true;
}
