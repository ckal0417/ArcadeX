import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { AuthService } from '../../../../feactures/services/private/auth.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-admin-layouts',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './admin-layouts.html',
  styleUrl: './admin-layouts.scss',
})
export class AdminLayouts {
  private auth = inject(AuthService);
  private router = inject(Router);

  collapsed = signal(false);

  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'people', label: 'Usuarios', route: '/admin/users' },
    { icon: 'sports_esports', label: 'Juegos', route: '/admin/game' },
    { icon: 'local_offer', label: 'Ofertas', route: '/admin/offerts' },
    { icon: 'category', label: 'Géneros', route: '/admin/genres' },
    { icon: 'emoji_events', label: 'Logros', route: '/admin/achievements' },
    { icon: 'rate_review', label: 'Reseñas', route: '/admin/reviews' },
    { icon: 'comment', label: 'Comentarios', route: '/admin/review-comments' },
    { icon: 'group', label: 'Amigos', route: '/admin/friends' },
    { icon: 'library_books', label: 'Biblioteca', route: '/admin/library' },
    { icon: 'favorite', label: 'Lista de Deseos', route: '/admin/wishlist' },
    { icon: 'videogame_asset', label: 'Sesiones', route: '/admin/game-sessions' },
  ];

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }

  logout(): void {
    this.auth.logout(this.router);
  }
}
