import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IOffert } from '../../../interfaces/private/Offert';
import { OffertService } from '../../../services/private/offert.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OffertFormComponent } from '../offert-form-component/offert-form-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
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

  offertService = inject(OffertService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.offertService.getAll()
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
        }
      });
  }

  buscar(query: string): void {
    this.searchQuery.set(query);
    if (!query.trim()) {
      this.filteredOfferts.set(this.offerts());
      return;
    }
    const q = query.toLowerCase();
    this.filteredOfferts.set(
      this.offerts().filter(o =>
        o.gameId.toLowerCase().includes(q) ||
        o.gameTitle.toLowerCase().includes(q)
      )
    );
  }

  crearOferta(): void {
    const dialogRef = this.dialog.open(OffertFormComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.offertService.create(result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Oferta creada exitosamente', 'Cerrar', { duration: 3000 });
              this.cargar();
            },
            error: () => this.snackBar.open('Error al crear la oferta', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  editarOferta(offert: IOffert): void {
    const dialogRef = this.dialog.open(OffertFormComponent, {
      width: '500px',
      data: offert
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.offertService.update(offert.offerId, result)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.snackBar.open('Oferta actualizada exitosamente', 'Cerrar', { duration: 3000 });
              this.cargar();
            },
            error: () => this.snackBar.open('Error al actualizar la oferta', 'Cerrar', { duration: 3000 })
          });
      }
    });
  }

  eliminarOferta(offert: IOffert): void {
    if (!confirm(`¿Eliminar esta oferta?`)) return;

    this.offertService.delete(offert.offerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Oferta eliminada', 'Cerrar', { duration: 3000 });
          this.cargar();
        },
        error: () => this.snackBar.open('Error al eliminar la oferta', 'Cerrar', { duration: 3000 })
      });
  }
}
