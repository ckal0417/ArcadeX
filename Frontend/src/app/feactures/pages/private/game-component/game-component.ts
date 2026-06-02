import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IGame } from '../../../interfaces/public/Game';
import { GameService } from '../../../services/private/game.service';
import { GameFormComponent } from '../game-form-component/game-form-component';

@Component({
  selector: 'app-game-component',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
  ],
  templateUrl: './game-component.html',
  styleUrl: './game-component.scss',
})
export class GameComponent implements OnInit {
  games = signal<IGame[]>([]);
  filteredGames = signal<IGame[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  searchQuery = signal('');

  private gameService = inject(GameService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.gameService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.games.set(data);
          this.filteredGames.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage.set('Error al cargar los juegos');
          this.loading.set(false);
        },
      });
  }

  buscar(query: string): void {
    this.searchQuery.set(query);

    if (!query.trim()) {
      this.filteredGames.set(this.games());
      return;
    }

    const q = query.toLowerCase();

    this.filteredGames.set(
      this.games().filter(
        (game) =>
          game.title.toLowerCase().includes(q) ||
          game.description.toLowerCase().includes(q) ||
          game.genres.join(', ').toLowerCase().includes(q)
      )
    );
  }

  crearJuego(): void {
    const dialogRef = this.dialog.open(GameFormComponent, {
      width: '560px',
      maxWidth: '92vw',
      data: null,
      panelClass: 'admin-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.gameService
        .create(result)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Juego creado exitosamente', 'Cerrar', {
              duration: 3000,
            });

            this.cargar();
          },
          error: () => {
            this.snackBar.open('Error al crear el juego', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    });
  }

  editarJuego(game: IGame): void {
    const dialogRef = this.dialog.open(GameFormComponent, {
      width: '560px',
      maxWidth: '92vw',
      data: game,
      panelClass: 'admin-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.gameService
        .update(game.id, result)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Juego actualizado exitosamente', 'Cerrar', {
              duration: 3000,
            });

            this.cargar();
          },
          error: () => {
            this.snackBar.open('Error al actualizar el juego', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    });
  }

  eliminarJuego(game: IGame): void {
    if (!confirm(`¿Eliminar "${game.title}"?`)) return;

    this.gameService
      .delete(game.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Juego eliminado', 'Cerrar', {
            duration: 3000,
          });

          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al eliminar el juego', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
}