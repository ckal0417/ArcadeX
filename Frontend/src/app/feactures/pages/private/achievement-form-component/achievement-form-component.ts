import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-achievement-form-component',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './achievement-form-component.html',
  styleUrl: './achievement-form-component.scss',
})
export class AchievementFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AchievementFormComponent>);
  data = inject(MAT_DIALOG_DATA);

  form = this.fb.group({
    gameId: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.dialogRef.close(this.form.value);
  }

  cancel() { this.dialogRef.close(); }
}
