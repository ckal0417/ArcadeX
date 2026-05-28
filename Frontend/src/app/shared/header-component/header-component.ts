import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-header-component',
  imports: [MatToolbarModule, MatIconModule, RouterLink, MatAnchor, MatButtonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  searchQuery = '';
  searchFocused = false;
}
