import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  @Input() navbarVisible = true;
  @Output() toggleNavbarEvent = new EventEmitter<void>();

  toggleNavbar(): void {
    this.toggleNavbarEvent.emit();
  }
}