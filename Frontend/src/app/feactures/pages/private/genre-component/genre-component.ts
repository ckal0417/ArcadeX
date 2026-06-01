import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GenreService } from '../../../services/private/genre.service';
import { GenreFormComponent } from '../genre-form-component/genre-form-component';
import { IGenre } from '../../../interfaces/private/Genre';

@Component({
  selector: 'app-genre-component',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './genre-component.html',
  styleUrl: './genre-component.scss',
})
export class GenreComponent implements OnInit {
  genres = signal<IGenre[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  private genreService = inject(GenreService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.genreService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.genres.set(data); this.loading.set(false); },
        error: () => { this.errorMessage.set('Error al cargar los géneros'); this.loading.set(false); }
      });
  }

  crearGenero(): void {
    const dialogRef = this.dialog.open(GenreFormComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.genreService.create(result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => { this.snackBar.open('Género creado exitosamente', 'Cerrar', { duration: 3000 }); this.cargar(); },
            error: () => this.snackBar.open('Error al crear el género', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }
}
