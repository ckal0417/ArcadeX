import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar-component/navbar-component';
import { FooterComponent } from './shared/footer-component/footer-component';
import { HeaderComponent } from './shared/header-component/header-component';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './feactures/services/private/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, NavbarComponent, MatDividerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Frontend');
  authService = inject(AuthService);
}
