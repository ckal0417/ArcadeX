import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LibraryService } from '../../../services/private/library.service';
import { ILibraryItem } from '../../../interfaces/private/Library';

@Component({
  selector: 'app-library-component',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './library-component.html',
  styleUrl: './library-component.scss',
})
export class LibraryComponent implements OnInit {
  items = signal<ILibraryItem[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  nuevoGameId = '';

  private libraryService = inject(LibraryService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.libraryService
      .getMine()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.items.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar la biblioteca');
          this.loading.set(false);
        },
      });
  }

  agregarJuego(): void {
    const gameId = this.nuevoGameId.trim();

    if (!gameId) return;

    this.libraryService
      .addGame(gameId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Juego agregado a la biblioteca', 'Cerrar', {
            duration: 3000,
          });

          this.nuevoGameId = '';
          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al agregar el juego', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
}