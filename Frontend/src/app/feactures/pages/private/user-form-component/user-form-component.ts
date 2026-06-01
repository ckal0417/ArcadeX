import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  data = inject<IUser | null>(MAT_DIALOG_DATA);

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.minLength(8)]],
    role: ['User', Validators.required]
  });

  roles = ['User', 'Admin', 'Developer', 'Publisher'];

  ngOnInit() {
    if (this.data) {
      this.userForm.patchValue({
        email: this.data.email,
        username: this.data.username,
        country: this.data.country ?? '',
        role: this.data.roles[0]
      });
    } else {
      this.userForm.get('password')!.addValidators(Validators.required);
      this.userForm.get('password')!.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { role, password, ...rest } = this.userForm.value;
    const payload: any = { ...this.data, ...rest, roles: [role] };
    if (password) {
      payload.password = password;
    }
    this.dialogRef.close(payload);
  }

  cancel() {
    this.dialogRef.close();
  }
}
