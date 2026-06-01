import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameSessionService } from '../../../services/private/game-session.service';
import { IGameSession } from '../../../interfaces/private/GameSession';

@Component({
  selector: 'app-game-session-component',
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
            MatProgressSpinnerModule, MatTooltipModule, MatFormFieldModule, MatInputModule],
  templateUrl: './game-session-component.html',
  styleUrl: './game-session-component.scss',
})
export class GameSessionComponent implements OnInit {
  sessions = signal<IGameSession[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  nuevoGameId = '';

  private sessionService = inject(GameSessionService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.sessionService.getMine()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.sessions.set(data); this.loading.set(false); },
        error: () => { this.errorMessage.set('Error al cargar las sesiones'); this.loading.set(false); }
      });
  }

  iniciarSesion(): void {
    if (!this.nuevoGameId.trim()) return;
    this.sessionService.start({ gameId: this.nuevoGameId.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.snackBar.open('Sesión iniciada', 'Cerrar', { duration: 3000 }); this.nuevoGameId = ''; this.cargar(); },
        error: () => this.snackBar.open('Error al iniciar la sesión', 'Cerrar', { duration: 3000 })
      });
  }

  terminarSesion(session: IGameSession): void {
    this.sessionService.end(session.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.snackBar.open('Sesión terminada', 'Cerrar', { duration: 3000 }); this.cargar(); },
        error: () => this.snackBar.open('Error al terminar la sesión', 'Cerrar', { duration: 3000 })
      });
  }
}
