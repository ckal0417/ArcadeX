import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GameService } from '../../../services/private/game.service';

@Component({
  selector: 'app-developer-game-create',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './developer-game-create.html',
  styleUrl: './developer-game-create.scss',
})
export class DeveloperGameCreateComponent {
  private fb = inject(FormBuilder);
  private gameService = inject(GameService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  serverError = signal('');

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    releaseDate: ['', Validators.required],
    genres: [''],
    coverImageUrl: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set('');

    const v = this.form.value;
    const genres = (v.genres ?? '')
      .split(',')
      .map(g => g.trim())
      .filter(g => g.length > 0);

    this.gameService
      .createGame({
        title: v.title!,
        description: v.description ?? undefined,
        price: v.price!,
        releaseDate: v.releaseDate!,
        genres,
        coverImageUrl: v.coverImageUrl || undefined,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.open('¡Juego publicado exitosamente!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/developer/my-games']);
        },
        error: (err: HttpErrorResponse) => {
          this.loading.set(false);
          if (err.status === 400) {
            this.serverError.set('Datos inválidos. Revisa los campos e intenta de nuevo.');
          } else if (err.status === 403) {
            this.serverError.set('No tienes permiso para publicar juegos.');
          } else {
            this.serverError.set('Error de conexión. Inténtalo de nuevo.');
          }
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/developer/my-games']);
  }
}
