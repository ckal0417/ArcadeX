import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { IReview } from '../../../interfaces/private/Review';

@Component({
  selector: 'app-review-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './review-form-component.html',
  styleUrl: './review-form-component.scss',
})
export class ReviewFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ReviewFormComponent>);

  data = inject<IReview | null>(MAT_DIALOG_DATA);

  ratings = [1, 2, 3, 4, 5];

  form = this.fb.group({
    gameId: ['', Validators.required],
    rating: [
      null as number | null,
      [Validators.required, Validators.min(1), Validators.max(5)],
    ],
    comment: [''],
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        rating: this.data.rating,
        comment: this.data.comment ?? '',
      });

      this.form.get('gameId')?.disable();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { gameId, ...reviewData } = this.form.getRawValue();

    const payload = this.data
      ? reviewData
      : { gameId, ...reviewData };

    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}