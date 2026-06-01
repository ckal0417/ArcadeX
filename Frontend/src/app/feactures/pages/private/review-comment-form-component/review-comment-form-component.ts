import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IReviewComment } from '../../../interfaces/private/ReviewComment';

@Component({
  selector: 'app-review-comment-form-component',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './review-comment-form-component.html',
  styleUrl: './review-comment-form-component.scss',
})
export class ReviewCommentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ReviewCommentFormComponent>);
  data = inject<IReviewComment | null>(MAT_DIALOG_DATA);

  form = this.fb.group({
    reviewId: ['', Validators.required],
    comment: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({ comment: this.data.comment });
      this.form.get('reviewId')!.disable();
    }
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { reviewId, comment } = this.form.getRawValue();
    const payload = this.data ? { comment } : { reviewId, comment };
    this.dialogRef.close(payload);
  }

  cancel() { this.dialogRef.close(); }
}
