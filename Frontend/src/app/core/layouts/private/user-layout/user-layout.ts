import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../feactures/services/private/auth.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-user-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
})
export class UserLayout {
  private auth = inject(AuthService);
  private router = inject(Router);

  collapsed = signal(false);

  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard/user/dashboard' },
    { icon: 'storefront', label: 'Tienda', route: '/dashboard/user/store' },
    { icon: 'library_books', label: 'Biblioteca', route: '/dashboard/user/library' },
    { icon: 'favorite', label: 'Lista de Deseos', route: '/dashboard/user/wishlist' },
    { icon: 'rate_review', label: 'Reseñas', route: '/dashboard/user/reviews' },
    { icon: 'group', label: 'Amigos', route: '/dashboard/user/friends' },
    { icon: 'videogame_asset', label: 'Sesiones', route: '/dashboard/user/game-sessions' },
  ];

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }

  logout(): void {
    this.auth.logout(this.router);
  }
}
