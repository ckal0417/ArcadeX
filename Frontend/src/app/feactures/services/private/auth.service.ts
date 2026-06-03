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

  private readonly USERNAME_KEY = 'arcadex_username';
  private readonly API = environment.apiUrl;
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly ROLES_KEY = 'arcadex_roles';

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _roles = signal<string[]>(this.loadRoles());

  isAuthenticated = computed(() => !!this._token());
  token = computed(() => this._token());
  roles = computed(() => this._roles());

  payload = computed<JwtPayload | null>(() => {
    const token = this._token();
    return token ? this.decodeToken(token) : null;
  });

  userEmail = computed(() => this.payload()?.email ?? null);
  userId = computed(() => this.payload()?.sub ?? null);

  username = computed(() => {
    const payload: any = this.payload();

    return (
      payload?.username ??
      payload?.userName ??
      payload?.name ??
      payload?.unique_name ??
      payload?.given_name ??
      payload?.email ??
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
      null
    );
  });

  mainRole = computed(() => {
    const role = this._roles()[0];

    if (role === 'User') return 'Usuario Final';
    if (role === 'Admin') return 'Administrador';
    if (role === 'Developer') return 'Desarrollador';

    return 'Usuario Final';
  });

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API}/Auth/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.ROLES_KEY, JSON.stringify(res.roles ?? []));

        this._token.set(res.token);
        this._roles.set(res.roles ?? []);
      })
    );
  }

  logout(router: any): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLES_KEY);

    this._token.set(null);
    this._roles.set([]);

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

        this._token.set(null);
        this._roles.set([]);

        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }
}