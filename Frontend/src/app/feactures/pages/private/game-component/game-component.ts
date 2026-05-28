import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-game-component',
  imports: [MatCardModule, ],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent {}
