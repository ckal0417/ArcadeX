import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer-component',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
