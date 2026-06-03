import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GameService } from '../../../services/private/game.service';
import { AuthService } from '../../../services/private/auth.service';
import { IGame } from '../../../interfaces/public/Game';

@Component({
  selector: 'app-developer-my-games',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './developer-my-games.html',
  styleUrl: './developer-my-games.scss',
})
export class DeveloperMyGamesComponent implements OnInit {
  games = signal<IGame[]>([]);
  selectedGame = signal<IGame | null>(null);

  loading = signal(false);
  errorMessage = signal('');

  private gameService = inject(GameService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const myId = String(this.authService.userId() ?? '');

    this.gameService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (all) => {
          this.games.set(myId ? all.filter((g) => g.ownerId === myId) : all);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar tus juegos. Inténtalo de nuevo.');
          this.loading.set(false);
        },
      });
  }

  goCreate(): void {
    this.router.navigate(['/dashboard/developer/create']);
  }

  openDetails(game: IGame): void {
    this.selectedGame.set(game);
  }

  closeDetails(): void {
    this.selectedGame.set(null);
  }
}