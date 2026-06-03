import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../enviroment/enroment";
import { IUser } from "../../interfaces/private/User";
import { RegisterRequest } from "../../interfaces/private/Register";

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/Users`;
  private http = inject(HttpClient);

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.url);
  }

  getById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.url}/${id}`);
  }

  create(payload: RegisterRequest): Observable<IUser> {
    return this.http.post<IUser>(this.url, payload);
  }

  update(id: string, payload: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.url}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}