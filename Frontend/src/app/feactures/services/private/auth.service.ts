import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../../enviroment/enroment';
import {
  JwtPayload,
  LoginRequest,
  LoginResponse,
} from '../../interfaces/private/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = environment.apiUrl;
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly ROLES_KEY = 'arcadex_roles';
  private readonly USERNAME_KEY = 'arcadex_username';
  private readonly EMAIL_KEY = 'arcadex_email';

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _roles = signal<string[]>(this.loadRoles());
  private _username = signal<string | null>(localStorage.getItem(this.USERNAME_KEY));
  private _email = signal<string | null>(localStorage.getItem(this.EMAIL_KEY));

  isAuthenticated = computed(() => !!this._token());
  token = computed(() => this._token());
  roles = computed(() => this._roles());

  payload = computed<JwtPayload | null>(() => {
    const token = this._token();
    return token ? this.decodeToken(token) : null;
  });

  userEmail = computed(() => {
    return (
      this._email() ??
      this.payload()?.email ??
      null
    );
  });

  userId = computed(() => this.payload()?.sub ?? null);

  username = computed(() => {
    return (
      this._username() ??
      this.payload()?.username ??
      this.payload()?.name ??
      this.userEmail() ??
      'Usuario'
    );
  });

  avatar = computed(() => {
    const payload: any = this.payload();

    return (
      payload?.avatar ??
      payload?.avatarUrl ??
      payload?.imageUrl ??
      payload?.picture ??
      localStorage.getItem('arcadex_avatar') ??
      null
    );
  });

  mainRole = computed(() => {
    const role = this._roles()[0];

    if (role === 'User') return 'Usuario';
    if (role === 'Admin') return 'Administrador';
    if (role === 'Developer') return 'Desarrollador';

    return 'Usuario';
  });

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.API}/Auth/login`, credentials)
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.ROLES_KEY, JSON.stringify(res.roles ?? []));
          localStorage.setItem(this.USERNAME_KEY, res.username);
          localStorage.setItem(this.EMAIL_KEY, res.email);

          this._token.set(res.token);
          this._roles.set(res.roles ?? []);
          this._username.set(res.username);
          this._email.set(res.email);
        })
      );
  }

  logout(router: any): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLES_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem('arcadex_avatar');

    this._token.set(null);
    this._roles.set([]);
    this._username.set(null);
    this._email.set(null);

    router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  getRoles(): string[] {
    return this._roles();
  }

  getDashboardRoute(): string {
    const roles = this._roles();

    if (roles.includes('Admin')) return '/dashboard/admin';
    if (roles.includes('Developer')) return '/dashboard/developer';

    return '/dashboard/user';
  }

  isAuthenticate(): boolean {
    return !!this._token();
  }

  private loadRoles(): string[] {
    try {
      return JSON.parse(localStorage.getItem(this.ROLES_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const parsed = JSON.parse(decoded) as JwtPayload;

      if (parsed.exp && parsed.exp * 1000 < Date.now()) {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ROLES_KEY);
        localStorage.removeItem(this.USERNAME_KEY);
        localStorage.removeItem(this.EMAIL_KEY);
        localStorage.removeItem('arcadex_avatar');

        this._token.set(null);
        this._roles.set([]);
        this._username.set(null);
        this._email.set(null);

        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }
}