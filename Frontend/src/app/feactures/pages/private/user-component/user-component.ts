import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserService } from '../../../services/private/user.service';
import { UserFormComponent } from '../user-form-component/user-form-component';
import { IUser } from '../../../interfaces/private/User';

@Component({
  selector: 'app-user-component',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule,
  ],
  templateUrl: './user-component.html',
  styleUrl: './user-component.scss',
})
export class UserComponent implements OnInit {
  users = signal<IUser[]>([]);
  filteredUsers = signal<IUser[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  searchQuery = signal('');

  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.userService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.users.set(data);
          this.filteredUsers.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage.set('Error al cargar los usuarios');
          this.loading.set(false);
        },
      });
  }

  buscar(query: string): void {
    this.searchQuery.set(query);

    const value = query.trim().toLowerCase();

    if (!value) {
      this.filteredUsers.set(this.users());
      return;
    }

    this.filteredUsers.set(
      this.users().filter((user) => {
        const email = user.email?.toLowerCase() ?? '';
        const username = user.username?.toLowerCase() ?? '';
        const role = user.roles?.[0]?.toLowerCase() ?? '';

        return (
          email.includes(value) ||
          username.includes(value) ||
          role.includes(value)
        );
      })
    );
  }

  crearUsuario(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '520px',
      maxWidth: '95vw',
      disableClose: true,
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.userService
        .create(result)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Usuario creado exitosamente', 'Cerrar', {
              duration: 3000,
            });

            this.cargar();
          },
          error: () => {
            this.snackBar.open('Error al crear el usuario', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    });
  }

  editarUsuario(user: IUser): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '520px',
      maxWidth: '95vw',
      disableClose: true,
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.userService
        .update(user.id, result)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', {
              duration: 3000,
            });

            this.cargar();
          },
          error: () => {
            this.snackBar.open('Error al actualizar el usuario', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    });
  }

  eliminarUsuario(user: IUser): void {
    const confirmDelete = confirm(`¿Eliminar a "${user.username}"?`);

    if (!confirmDelete) return;

    this.userService
      .delete(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', {
            duration: 3000,
          });

          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al eliminar el usuario', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
}