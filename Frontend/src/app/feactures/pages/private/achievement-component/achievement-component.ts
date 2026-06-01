import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AchievementService } from '../../../services/private/achievement.service';
import { AchievementFormComponent } from '../achievement-form-component/achievement-form-component';
import { IAchievement } from '../../../interfaces/private/Achievement';

@Component({
  selector: 'app-achievement-component',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './achievement-component.html',
  styleUrl: './achievement-component.scss',
})
export class AchievementComponent implements OnInit {
  achievements = signal<IAchievement[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  private achievementService = inject(AchievementService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.achievementService.getMine()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.achievements.set(data); this.loading.set(false); },
        error: () => { this.errorMessage.set('Error al cargar los logros'); this.loading.set(false); }
      });
  }

  crearLogro(): void {
    const dialogRef = this.dialog.open(AchievementFormComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.achievementService.create(result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => { this.snackBar.open('Logro creado exitosamente', 'Cerrar', { duration: 3000 }); this.cargar(); },
            error: () => this.snackBar.open('Error al crear el logro', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  desbloquear(achievement: IAchievement): void {
    this.achievementService.unlock(achievement.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.snackBar.open('Logro desbloqueado', 'Cerrar', { duration: 3000 }),
        error: () => this.snackBar.open('Error al desbloquear el logro', 'Cerrar', { duration: 3000 })
      });
  }
}
