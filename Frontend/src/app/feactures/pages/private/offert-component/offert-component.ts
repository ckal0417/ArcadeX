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

import { IOffert } from '../../../interfaces/private/Offert';
import { OffertService } from '../../../services/private/offert.service';
import { OffertFormComponent } from '../offert-form-component/offert-form-component';

@Component({
  selector: 'app-offert-component',
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
  templateUrl: './offert-component.html',
  styleUrl: './offert-component.scss',
})
export class OffertComponent implements OnInit {
  offerts = signal<IOffert[]>([]);
  filteredOfferts = signal<IOffert[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  searchQuery = signal('');

  private offertService = inject(OffertService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.offertService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.offerts.set(data);
          this.filteredOfferts.set(data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage.set('Error al cargar las ofertas');
          this.loading.set(false);
        },
      });
  }

  buscar(query: string): void {
    this.searchQuery.set(query);

    const value = query.trim().toLowerCase();

    if (!value) {
      this.filteredOfferts.set(this.offerts());
      return;
    }

    this.filteredOfferts.set(
      this.offerts().filter((offert) => {
        const gameId = offert.gameId?.toLowerCase() ?? '';
        const gameTitle = offert.gameTitle?.toLowerCase() ?? '';

        return gameId.includes(value) || gameTitle.includes(value);
      })
    );
  }

  crearOferta(): void {
    const dialogRef = this.dialog.open(OffertFormComponent, {
      width: '520px',
      maxWidth: '95vw',
      disableClose: true,
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.offertService
        .create(result)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Oferta creada exitosamente', 'Cerrar', {
              duration: 3000,
            });

            this.cargar();
          },
          error: () => {
            this.snackBar.open('Error al crear la oferta', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    });
  }

  editarOferta(offert: IOffert): void {
    const dialogRef = this.dialog.open(OffertFormComponent, {
      width: '520px',
      maxWidth: '95vw',
      disableClose: true,
      data: offert,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.offertService
        .update(offert.offerId, result)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.snackBar.open('Oferta actualizada exitosamente', 'Cerrar', {
              duration: 3000,
            });

            this.cargar();
          },
          error: () => {
            this.snackBar.open('Error al actualizar la oferta', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    });
  }

  eliminarOferta(offert: IOffert): void {
    const confirmDelete = confirm(
      `¿Eliminar la oferta de "${offert.gameTitle}"?`
    );

    if (!confirmDelete) return;

    this.offertService
      .delete(offert.offerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Oferta eliminada', 'Cerrar', {
            duration: 3000,
          });

          this.cargar();
        },
        error: () => {
          this.snackBar.open('Error al eliminar la oferta', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
}