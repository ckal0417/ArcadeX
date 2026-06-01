import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IGame, IResponseGames } from '../../../interfaces/public/Game';
import { HomeComponent } from '../home-component/home-component';
import { HomeService } from '../../../services/public/home.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-games-component',
  imports: [MatCardModule, MatProgressSpinnerModule],
  templateUrl: './games-component.html',
  styleUrl: './games-component.scss',
})
export class GamesComponent implements OnInit {

  games = signal<IGame[]>([]);
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

}

