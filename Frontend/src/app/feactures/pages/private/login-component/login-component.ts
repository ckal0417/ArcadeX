import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCheckboxModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {}
