import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserService, IUser } from '../../../services/private/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFormComponent } from '../user-form-component/user-form-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
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

  userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.userService.getAll()
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
        }
      });
  }

  buscar(query: string): void {
    this.searchQuery.set(query);
    if (!query.trim()) {
      this.filteredUsers.set(this.users());
      return;
    }
    const q = query.toLowerCase();
    this.filteredUsers.set(
      this.users().filter(u =>
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      )
    );
  }

  crearUsuario(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.create(result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
              this.cargar();
            },
            error: () => this.snackBar.open('Error al crear el usuario', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  editarUsuario(user: IUser): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.update(user.id, result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', { duration: 3000 });
              this.cargar();
            },
            error: () => this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  eliminarUsuario(user: IUser): void {
    if (!confirm(`¿Eliminar a "${user.username}"?`)) return;

    this.userService.delete(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
          this.cargar();
        },
        error: () => this.snackBar.open('Error al eliminar el usuario', 'Cerrar', { duration: 3000 })
      });
  }
}
