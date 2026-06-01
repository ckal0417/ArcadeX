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
import { WishlistService } from '../../../services/private/wishlist.service';
import { IWishlistItem } from '../../../interfaces/private/Wishlist';

@Component({
  selector: 'app-wishlist-component',
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
            MatProgressSpinnerModule, MatTooltipModule, MatFormFieldModule, MatInputModule],
  templateUrl: './wishlist-component.html',
  styleUrl: './wishlist-component.scss',
})
export class WishlistComponent implements OnInit {
  items = signal<IWishlistItem[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  nuevoGameId = '';

  private wishlistService = inject(WishlistService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.wishlistService.getMine()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.items.set(data); this.loading.set(false); },
        error: () => { this.errorMessage.set('Error al cargar la lista de deseos'); this.loading.set(false); }
      });
  }

  agregar(): void {
    if (!this.nuevoGameId.trim()) return;
    this.wishlistService.add(this.nuevoGameId.trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.snackBar.open('Juego agregado a la lista de deseos', 'Cerrar', { duration: 3000 }); this.nuevoGameId = ''; this.cargar(); },
        error: () => this.snackBar.open('Error al agregar el juego', 'Cerrar', { duration: 3000 })
      });
  }

  eliminar(item: IWishlistItem): void {
    if (!confirm(`¿Eliminar "${item.title}" de tu lista de deseos?`)) return;
    this.wishlistService.remove(item.gameId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => { this.snackBar.open('Juego eliminado de la lista', 'Cerrar', { duration: 3000 }); this.cargar(); },
        error: () => this.snackBar.open('Error al eliminar el juego', 'Cerrar', { duration: 3000 })
      });
  }
}
