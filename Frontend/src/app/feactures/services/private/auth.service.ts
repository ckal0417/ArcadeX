import { computed, Injectable, signal } from "@angular/core";
import { environment } from "../../../../enviroment/enroment";
import { JwtPayload, LoginRequest, LoginResponse } from "../../interfaces/private/Auth";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable ({
  providedIn: 'root'
})
export class AuthService {

  private readonly API = environment.apiUrl;
  private readonly TOKEN_KEY = environment.tokenKey;

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  isAuthenticated = computed(() => !!this._token());
  token = computed(() => this._token());

  payload = computed<JwtPayload | null>(() => {
    const t = this._token();
    return t ? this.decodeToken(t) : null;
  });

  userEmail = computed(() => this.payload()?.email ?? null);
  userId = computed(() => this.payload()?.sub ?? null);

  constructor(private http: HttpClient){}

  login(credentials: LoginRequest) {
    return this.http
    .post<LoginResponse>(`${this.API}/Auth/login`, credentials)
    .pipe(
      tap( (res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this._token.set(res.token);
      })
    );
  }

  logout(router: any) {
    localStorage.removeItem(this.TOKEN_KEY);
    this._token.set(null);
    router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
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
