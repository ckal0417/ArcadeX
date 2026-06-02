import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IGame } from '../../../interfaces/public/Game';
import { HomeService } from '../../../services/public/home.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-games-component',
  imports: [MatCardModule, MatProgressSpinnerModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './games-component.html',
  styleUrl: './games-component.scss',
})
export class GamesComponent implements OnInit {

  games = signal<IGame[]>([]);
  filteredGames = signal<IGame[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  searchQuery = signal('');

  homeService = inject(HomeService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.cargarJuegos();
  }

  cargarJuegos() {
    this.loading.set(true);
    this.homeService.getGames()
          .pipe(
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe({
            next: (data) => {
              this.games.set(data);
              this.filteredGames.set(data);
              this.loading.set(false);
            },
            error: (error) => {
              console.error('Error en API:', error);
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
      this.games().filter(
        (game) =>
          game.title.toLowerCase().includes(q) ||
          game.description.toLowerCase().includes(q) ||
          game.genres.join(', ').toLowerCase().includes(q)
      )
    );
  }

}

