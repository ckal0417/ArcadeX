import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-component',
  imports: [MatIconModule, MatCardModule],
  templateUrl: './user-component.html',
  styleUrl: './user-component.scss',
})
export class UserComponent {}
