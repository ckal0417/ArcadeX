import { computed, Injectable, signal } from "@angular/core";
import { environment } from "../../../../enviroment/enroment";
import { JwtPayload, LoginRequest, LoginResponse } from "../../interfaces/private/Auth";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = environment.apiUrl;
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly ROLES_KEY = 'arcadex_roles';

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _roles = signal<string[]>(this.loadRoles());

  isAuthenticated = computed(() => !!this._token());
  token = computed(() => this._token());

  payload = computed<JwtPayload | null>(() => {
    const t = this._token();
    return t ? this.decodeToken(t) : null;
  });

  userEmail = computed(() => this.payload()?.email ?? null);
  userId = computed(() => this.payload()?.sub ?? null);

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.API}/Auth/login`, credentials)
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.ROLES_KEY, JSON.stringify(res.roles ?? []));
          this._token.set(res.token);
          this._roles.set(res.roles ?? []);
        })
      );
  }

  logout(router: any) {
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
        this._token.set(null);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  isAuthenticate(): boolean {
    return !!localStorage.getItem('token');
  }
}
