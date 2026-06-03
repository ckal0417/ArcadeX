import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/private/auth.service';
import { UserService } from '../../../services/private/user.service';

@Component({
  selector: 'app-profile-component',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  defaultAvatar = 'assets/branding/logo.png';

  userId = signal<string>('');
  username = this.auth.username;
  email = this.auth.userEmail;
  role = this.auth.mainRole;

  previewAvatar = signal(this.defaultAvatar);

  profileForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    avatar: [''],
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        const avatarUrl = user.avatarUrl?.trim() ?? '';

        this.userId.set(user.id);

        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          avatar: avatarUrl,
        });

        this.previewAvatar.set(
          avatarUrl !== '' ? avatarUrl : this.defaultAvatar
        );

        localStorage.setItem('arcadex_username', user.username);
        localStorage.setItem('arcadex_email', user.email);

        if (avatarUrl !== '') {
          localStorage.setItem('arcadex_avatar', avatarUrl);
        } else {
          localStorage.removeItem('arcadex_avatar');
        }
      },
      error: () => {
        this.userId.set(this.auth.userId() ?? '');

        this.profileForm.patchValue({
          username: this.username(),
          email: this.email() ?? '',
          avatar: '',
        });

        this.previewAvatar.set(this.defaultAvatar);

        this.snackBar.open('Error al cargar el perfil', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  previewAvatarChange(): void {
    const avatar = this.profileForm.value.avatar?.trim() ?? '';

    if (avatar === '') {
      this.previewAvatar.set(this.defaultAvatar);
      return;
    }

    this.previewAvatar.set(avatar);
  }

  setDefaultAvatar(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.defaultAvatar;
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();

      this.snackBar.open('Revisa los campos del formulario', 'Cerrar', {
        duration: 3000,
      });

      return;
    }

    const payload = {
      username: this.profileForm.value.username?.trim() ?? '',
      email: this.profileForm.value.email?.trim() ?? '',
      avatarUrl: this.profileForm.value.avatar?.trim() ?? '',
    };

    this.userService.updateMe(payload).subscribe({
      next: (user) => {
        const avatarUrl = user.avatarUrl?.trim() ?? '';

        localStorage.setItem('arcadex_username', user.username);
        localStorage.setItem('arcadex_email', user.email);

        if (avatarUrl !== '') {
          localStorage.setItem('arcadex_avatar', avatarUrl);
        } else {
          localStorage.removeItem('arcadex_avatar');
        }

        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          avatar: avatarUrl,
        });

        this.previewAvatar.set(
          avatarUrl !== '' ? avatarUrl : this.defaultAvatar
        );

        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}