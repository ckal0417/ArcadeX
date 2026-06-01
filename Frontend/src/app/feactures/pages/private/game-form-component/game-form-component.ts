import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IGame } from '../../../interfaces/public/Game';

@Component({
  selector: 'app-game-form-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './game-form-component.html',
  styleUrl: './game-form-component.scss',
})
export class GameFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<GameFormComponent>);

  data = inject<IGame | null>(MAT_DIALOG_DATA);

  gameForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(0)]],
    releaseDate: ['', Validators.required],
    genres: ['', Validators.required]
  });

  ngOnInit() {
    if (this.data) {
      this.gameForm.patchValue({
        title: this.data.title,
        description: this.data.description,
        price: this.data.price,
        releaseDate: this.data.releaseDate,
        genres: this.data.genres?.join(', ')
      });
    }
  }

  onSubmit() {
    if (this.gameForm.invalid) {
      this.gameForm.markAllAsTouched();
      return;
    }

    const formValue = this.gameForm.value;
    const genres = (formValue.genres as string).split(',').map(g => g.trim());

    this.dialogRef.close({
      ...this.data,
      ...formValue,
      genres
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
