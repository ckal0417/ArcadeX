import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAnchor } from "@angular/material/button";
import { MatSidenavModule } from '@angular/material/sidenav';
import { IGame } from '../../../interfaces/public/Game';
import { HomeService } from '../../../services/public/home.service';

@Component({
  selector: 'app-home-component',
  imports: [MatProgressSpinnerModule, MatCardModule, MatToolbarModule,
    MatIconModule, MatAnchor, MatSidenavModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent implements OnInit {
  loading = signal(false);
  sidebarOpen = true;
  games = signal<IGame[]>([]);
  errorMessage = signal('');
  searchQuery = signal('');

  homeService = inject(HomeService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.cargarJuegos();
  }

  cargarJuegos(): void {
    this.loading.set(true);
    this.homeService.getGames()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
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
}
