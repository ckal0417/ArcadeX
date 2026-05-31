import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IGame } from '../../../interfaces/public/Game';
import { GameService } from '../../../services/private/game.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameFormComponent } from '../game-form-component/game-form-component';

@Component({
  selector: 'app-game-component',
  imports: [MatCardModule, ],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent {
  games = signal<IGame[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  searchQuery = signal('');

  gameService = inject(GameService);
  constructor(private dialogRef: MatDialog) {}
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.gameService.get().subscribe({
      next: (data) => {
        this.games.set(data.game);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar los juegos');
        this.loading.set(false);
      }
    });
  }

  abrirFormulario(product: IGame | null = null){
    const dialogRef = this.dialogRef.open(GameFormComponent, {
      width: '480px',
      data: product
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargar();
      }
    });
  }

  delete(game: IGame) {
        if (!confirm(`¿Eliminar "${game.title}"?`)) return;
        this.gameService.delete(game.id).subscribe({
            next: () => {
                this.games.update((list) => list.filter((p) => p.id !== game.id));
                this.snackBar.open('Juego eliminado', 'Cerrar', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 }),
        });
    }
}
