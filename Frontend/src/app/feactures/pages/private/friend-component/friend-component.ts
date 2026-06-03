import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FriendService } from '../../../services/private/friend.service';
import { FriendInterface } from '../../../interfaces/private/Friend';

@Component({
  selector: 'app-friend-component',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './friend-component.html',
  styleUrl: './friend-component.scss',
})
export class FriendComponent implements OnInit {
  friends = signal<FriendInterface[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  nuevoAmigoId = '';

  private friendService = inject(FriendService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.friendService
      .getMine()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.friends.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar los amigos');
          this.loading.set(false);
        },
      });
  }

  enviarSolicitud(): void {
    const userId = this.nuevoAmigoId.trim();

    if (!userId) {
      this.snackBar.open('Ingresa el ID del usuario', 'Cerrar', {
        duration: 3000,
      });

      return;
    }

    this.friendService
      .sendRequest(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Solicitud enviada', 'Cerrar', {
            duration: 3000,
          });

          this.nuevoAmigoId = '';
          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al enviar la solicitud', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  aceptar(friend: FriendInterface): void {
    this.friendService
      .accept(friend.friendId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Solicitud aceptada', 'Cerrar', {
            duration: 3000,
          });

          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al aceptar la solicitud', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  rechazar(friend: FriendInterface): void {
    this.friendService
      .reject(friend.friendId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Solicitud rechazada', 'Cerrar', {
            duration: 3000,
          });

          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al rechazar la solicitud', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  cancelar(friend: FriendInterface): void {
    this.friendService
      .cancel(friend.friendId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Solicitud cancelada', 'Cerrar', {
            duration: 3000,
          });

          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al cancelar la solicitud', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  eliminar(friend: FriendInterface): void {
    if (!confirm(`¿Eliminar a "${friend.friendUsername}" de tus amigos?`)) return;

    this.friendService
      .remove(friend.friendId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Amigo eliminado', 'Cerrar', {
            duration: 3000,
          });

          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al eliminar el amigo', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
}