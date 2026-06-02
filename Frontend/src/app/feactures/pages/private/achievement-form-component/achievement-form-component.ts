import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { IGame } from '../../../interfaces/public/Game';
import { GameService } from '../../../services/private/game.service';

@Component({
  selector: 'app-achievement-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './achievement-form-component.html',
  styleUrl: './achievement-form-component.scss',
})
export class AchievementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AchievementFormComponent>);
  private gameService = inject(GameService);
  private destroyRef = inject(DestroyRef);

  data = inject(MAT_DIALOG_DATA);

  games = signal<IGame[]>([]);
  loadingGames = signal(false);

  form = this.fb.group({
    gameId: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
  });

  ngOnInit(): void {
    this.cargarJuegos();
  }

  cargarJuegos(): void {
    this.loadingGames.set(true);

    this.gameService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.games.set(data);
          this.loadingGames.set(false);
        },
        error: () => {
          this.loadingGames.set(false);
        },
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}