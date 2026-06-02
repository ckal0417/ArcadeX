import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ReviewService } from '../../../services/private/review.service';
import { ReviewFormComponent } from '../review-form-component/review-form-component';
import { IReview } from '../../../interfaces/private/Review';

@Component({
  selector: 'app-review-component',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './review-component.html',
  styleUrl: './review-component.scss',
})
export class ReviewComponent implements OnInit {
  reviews = signal<IReview[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  private reviewService = inject(ReviewService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.reviewService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.reviews.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar las reseñas');
          this.loading.set(false);
        },
      });
  }

  crearResena(): void {
    const dialogRef = this.dialog.open(ReviewFormComponent, {
      width: '520px',
      maxWidth: '95vw',
      disableClose: true,
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.reviewService
        .create(result)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Reseña creada exitosamente', 'Cerrar', {
              duration: 3000,
            });

            this.cargar();
          },
          error: () => {
            this.snackBar.open('Error al crear la reseña', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    });
  }

  editarResena(review: IReview): void {
    const dialogRef = this.dialog.open(ReviewFormComponent, {
      width: '520px',
      maxWidth: '95vw',
      disableClose: true,
      data: review,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.reviewService
        .update(review.id, result)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Reseña actualizada', 'Cerrar', {
              duration: 3000,
            });

            this.cargar();
          },
          error: () => {
            this.snackBar.open('Error al actualizar la reseña', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    });
  }

  eliminarResena(review: IReview): void {
    const confirmDelete = confirm('¿Eliminar esta reseña?');

    if (!confirmDelete) return;

    this.reviewService
      .delete(review.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Reseña eliminada', 'Cerrar', {
            duration: 3000,
          });

          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al eliminar la reseña', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
}