import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IGame } from '../../../interfaces/public/Game';
import { GameService } from '../../../services/private/game.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameFormComponent } from '../game-form-component/game-form-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-game-component',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule
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

  gameService = inject(GameService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.gameService.getAll()
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
        }
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
      this.games().filter(g => 
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      )
    );
  }

  crearJuego(): void {
    const dialogRef = this.dialog.open(GameFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gameService.create(result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Juego creado exitosamente', 'Cerrar', { duration: 3000 });
              this.cargar();
            },
            error: () => this.snackBar.open('Error al crear el juego', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  editarJuego(game: IGame): void {
    const dialogRef = this.dialog.open(GameFormComponent, {
      width: '500px',
      data: game
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gameService.update(game.id, result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Juego actualizado exitosamente', 'Cerrar', { duration: 3000 });
              this.cargar();
            },
            error: () => this.snackBar.open('Error al actualizar el juego', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  eliminarJuego(game: IGame): void {
    if (!confirm(`¿Eliminar "${game.title}"?`)) return;
    
    this.gameService.delete(game.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Juego eliminado', 'Cerrar', { duration: 3000 });
          this.cargar();
        },
        error: () => this.snackBar.open('Error al eliminar el juego', 'Cerrar', { duration: 3000 })
      });
  }
}
