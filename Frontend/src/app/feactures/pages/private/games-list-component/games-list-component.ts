import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { GameService } from '../../../services/private/game.service';
import { LibraryService } from '../../../services/private/library.service';
import { IGame } from '../../../interfaces/public/Game';

@Component({
  selector: 'app-games-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './games-list-component.html',
  styleUrl: './games-list-component.scss',
})
export class GamesListComponent implements OnInit {
  games = signal<IGame[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  ownedIds = signal<Set<string>>(new Set());
  buyingIds = signal<Set<string>>(new Set());

  private gameService = inject(GameService);
  private libraryService = inject(LibraryService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      games: this.gameService.getAll(),
      library: this.libraryService.getMine(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ games, library }) => {
          this.games.set(games);
          this.ownedIds.set(new Set(library.map(item => item.gameId)));
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar los juegos. Inténtalo de nuevo.');
          this.loading.set(false);
        },
      });
  }

  isOwned(gameId: string): boolean {
    return this.ownedIds().has(gameId);
  }

  isBuying(gameId: string): boolean {
    return this.buyingIds().has(gameId);
  }

  comprar(game: IGame): void {
    if (this.isOwned(game.id) || this.isBuying(game.id)) return;

    const buying = new Set(this.buyingIds());
    buying.add(game.id);
    this.buyingIds.set(buying);

    this.libraryService
      .addGame(game.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const buying = new Set(this.buyingIds());
          buying.delete(game.id);
          this.buyingIds.set(buying);

          const owned = new Set(this.ownedIds());
          owned.add(game.id);
          this.ownedIds.set(owned);

          this.snackBar.open(`¡${game.title} añadido a tu biblioteca!`, 'Cerrar', {
            duration: 3000,
          });
        },
        error: (err: HttpErrorResponse) => {
          const buying = new Set(this.buyingIds());
          buying.delete(game.id);
          this.buyingIds.set(buying);

          if (err.status === 409) {
            const owned = new Set(this.ownedIds());
            owned.add(game.id);
            this.ownedIds.set(owned);

            this.snackBar.open('Ya tienes este juego en tu biblioteca.', 'Cerrar', {
              duration: 3000,
            });
          } else {
            this.snackBar.open(
              'Error al procesar la compra. Inténtalo de nuevo.',
              'Cerrar',
              { duration: 4000 }
            );
          }
        },
      });
  }
}
