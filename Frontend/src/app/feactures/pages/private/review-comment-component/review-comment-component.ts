import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReviewCommentService } from '../../../services/private/review-comment.service';
import { ReviewCommentFormComponent } from '../review-comment-form-component/review-comment-form-component';
import { IReviewComment } from '../../../interfaces/private/ReviewComment';

@Component({
  selector: 'app-review-comment-component',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,
            MatTooltipModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './review-comment-component.html',
  styleUrl: './review-comment-component.scss',
})
export class ReviewCommentComponent implements OnInit {
  comments = signal<IReviewComment[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  reviewIdFiltro = '';

  private commentService = inject(ReviewCommentService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {}

  buscarPorResena(): void {
    if (!this.reviewIdFiltro.trim()) return;
    this.loading.set(true);
    this.errorMessage.set('');
    this.commentService.getByReview(this.reviewIdFiltro.trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.comments.set(data); this.loading.set(false); },
        error: () => { this.errorMessage.set('Error al cargar los comentarios'); this.loading.set(false); }
      });
  }

  crearComentario(): void {
    const dialogRef = this.dialog.open(ReviewCommentFormComponent, { width: '500px', data: null });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commentService.create(result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => { this.snackBar.open('Comentario creado', 'Cerrar', { duration: 3000 }); this.buscarPorResena(); },
            error: () => this.snackBar.open('Error al crear el comentario', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  editarComentario(comment: IReviewComment): void {
    const dialogRef = this.dialog.open(ReviewCommentFormComponent, { width: '500px', data: comment });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commentService.update(comment.id, result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => { this.snackBar.open('Comentario actualizado', 'Cerrar', { duration: 3000 }); this.buscarPorResena(); },
            error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  eliminarComentario(comment: IReviewComment): void {
    if (!confirm('¿Eliminar este comentario?')) return;
    this.commentService.delete(comment.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.snackBar.open('Comentario eliminado', 'Cerrar', { duration: 3000 }); this.buscarPorResena(); },
        error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
      });
  }
}
