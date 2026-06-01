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
  selector: 'app-admin-layouts',
  imports: [RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatTooltipModule],
  templateUrl: './admin-layouts.html',
  styleUrl: './admin-layouts.scss',
})
export class AdminLayouts {

  private auth = inject(AuthService);
    private router = inject(Router);

    collapsed = signal(false);

    navItems: NavItem[] = [
        { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
        { icon: 'shopping_bag', label: 'Productos', route: '/admin/products' },
        { icon: 'shopping_cart', label: 'Carritos', route: '/admin/carts' }
    ];

    toggle() {
        this.collapsed.set(!this.collapsed());
    }

    logout() {
        this.auth.logout(this.router);
    }
}
