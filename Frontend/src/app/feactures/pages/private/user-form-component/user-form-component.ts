import { Component, inject, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { IUser } from '../../../interfaces/private/User';

@Component({
  selector: 'app-user-form-component',
  imports: [
    UpperCasePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserFormComponent>);

  data = inject<IUser | null>(MAT_DIALOG_DATA);

  showPassword = false;

  roles = ['User', 'Admin', 'Developer', 'Publisher'];

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.minLength(3)]],
    password: ['', [Validators.minLength(8)]],
    role: ['User', Validators.required],
  });

  ngOnInit(): void {
    if (this.data) {
      this.userForm.patchValue({
        email: this.data.email,
        username: this.data.username,
        country: this.data.country ?? '',
        role: this.data.roles?.[0] ?? 'User',
      });

      return;
    }

    const passwordControl = this.userForm.get('password');

    passwordControl?.addValidators(Validators.required);
    passwordControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { role, password, ...userData } = this.userForm.getRawValue();

    const selectedRole = role ?? 'User';

    const payload: any = {
      ...this.data,
      ...userData,
      roles: [selectedRole],
    };

    if (password) {
      payload.password = password;
    }

    this.dialogRef.close(payload);
  }
  cancel(): void {
    this.dialogRef.close();
  }
}