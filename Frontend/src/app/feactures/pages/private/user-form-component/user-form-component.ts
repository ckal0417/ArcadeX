import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IUser } from '../../../services/private/user.service';

@Component({
  selector: 'app-user-form-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserFormComponent>);

  @Inject(MAT_DIALOG_DATA) data: IUser | null = null;

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    role: ['user', Validators.required]
  });

  roles = ['user', 'admin', 'moderator'];

  ngOnInit() {
    if (this.data) {
      this.userForm.patchValue({
        email: this.data.email,
        username: this.data.username,
        role: this.data.role
      });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.userForm.value
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
