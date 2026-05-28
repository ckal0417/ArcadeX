import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-component',
  imports: [MatCardModule, ReactiveFormsModule, MatCheckboxModule, MatButtonModule,
    MatIconModule, MatInputModule,
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirmPassword = true;

  form = new FormGroup({
    username: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40),
          Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,:'"()-]+$/),
        ]
      }
    ),

    email: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.email,
        ]
      }
    ),

    password: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,:'"()-]+$/),
        ]
      }
    ),

    confirnPassword: new FormControl('',
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,:'"()-]+$/),
        ]
      }
    ),

  })
}
