import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IGame } from '../../../interfaces/public/Game';
import { GameService } from '../../../services/private/game.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameFormComponent } from '../game-form-component/game-form-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);
  constructor(private dialogRef: MatDialog) {}
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.gameService.get()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          console.log('Respuesta del API:', data);
          this.games.set(data);
          console.log('Games signal actualizado:', this.games());
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error en API:', error);
          this.errorMessage.set('Error al cargar los juegos');
          this.loading.set(false);
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
