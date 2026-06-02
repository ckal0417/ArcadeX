import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-component',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './about-component.html',
  styleUrl: './about-component.scss',
})
export class AboutComponent {}