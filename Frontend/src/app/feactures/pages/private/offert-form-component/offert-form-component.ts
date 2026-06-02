import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IOffert } from '../../../interfaces/private/Offert';
import { GameService } from '../../../services/private/game.service';
import { IGame } from '../../../interfaces/public/Game';

@Component({
  selector: 'app-offert-form-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './offert-form-component.html',
  styleUrl: './offert-form-component.scss',
})
export class OffertFormComponent implements OnInit {
  form!: FormGroup;
  games = signal<IGame[]>([]);
  loading = signal(false);

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<OffertFormComponent>);
  private gameService = inject(GameService);
  private destroyRef = inject(DestroyRef);

  data = inject<IOffert | null>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.initForm();
    this.loadGames();
  }

  private initForm(): void {
    this.form = this.fb.group({
      gameId: ['', Validators.required],
      discountPct: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    if (this.data) {
      this.form.patchValue({
        gameId: this.data.gameId,
        discountPct: this.data.discountPct,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
      });
    }
  }

  private loadGames(): void {
    this.loading.set(true);

    this.gameService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.games.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
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

  onCancel(): void {
    this.dialogRef.close();
  }
}