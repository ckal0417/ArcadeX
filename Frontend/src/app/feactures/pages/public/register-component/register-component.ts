import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/private/user.service';
import { RegisterRequest } from '../../../interfaces/private/Register';

@Component({
  selector: 'app-register-component',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  hidePassword = true;
  hideConfirmPassword = true;
  loading = signal(false);

  form = new FormGroup(
    {
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ],
      }),

      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
        ],
      }),

      country: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
        ],
      }),

      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
        ],
      }),

      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
        ],
      }),

      acceptTerms: new FormControl(false, {
        nonNullable: true,
        validators: [
          Validators.requiredTrue,
        ],
      }),
    },
    {
      validators: RegisterComponent.passwordsMatch,
    }
  );

  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { username, email, password, country } = this.form.getRawValue();

    const payload: RegisterRequest = {
      username,
      email,
      password,
      country,
    };

    this.userService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);

        this.snackBar.open(
          'Cuenta creada correctamente. Ahora inicia sesión.',
          'Cerrar',
          { duration: 3500 }
        );

        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);

        console.error('Error registrando usuario:', err);

        this.snackBar.open(
          `Error al crear la cuenta (${err?.status ?? 'desconocido'})`,
          'Cerrar',
          { duration: 4500 }
        );
      },
    });
  }
}