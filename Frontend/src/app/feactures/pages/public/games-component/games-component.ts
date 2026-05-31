import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IGame, IResponseGames } from '../../../interfaces/public/Game';
import { HomeComponent } from '../home-component/home-component';
import { HomeService } from '../../../services/public/home.service';

@Component({
  selector: 'app-games-component',
  imports: [MatCardModule],
  templateUrl: './games-component.html',
  styleUrl: './games-component.scss',
})
export class GamesComponent implements OnInit {

  games = signal<IGame[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  searchQuery = signal('');

  homeService = inject(HomeService);

  ngOnInit(): void {
    this.cargarJuegos();
  }

  cargarJuegos() {
    this.loading.set(true);
    this.homeService.getGames().subscribe({
      next: (data) => {
        this.games.set(data.game);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar los productos');
        this.loading.set(false);
      }
    });
  }

}

