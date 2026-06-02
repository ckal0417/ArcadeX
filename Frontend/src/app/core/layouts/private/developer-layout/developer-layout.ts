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
  selector: 'app-developer-layout',
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
  templateUrl: './developer-layout.html',
  styleUrl: './developer-layout.scss',
})
export class DeveloperLayout {
  private auth = inject(AuthService);
  private router = inject(Router);

  collapsed = signal(false);

  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard/developer/dashboard' },
    { icon: 'add_circle', label: 'Publicar Juego', route: '/dashboard/developer/create' },
    { icon: 'sports_esports', label: 'Mis Juegos', route: '/dashboard/developer/my-games' },
    { icon: 'emoji_events', label: 'Logros', route: '/dashboard/developer/achievements' },
    { icon: 'rate_review', label: 'Reseñas', route: '/dashboard/developer/reviews' },
  ];

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }

  logout(): void {
    this.auth.logout(this.router);
  }
}
