import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../enviroment/enroment";

export interface IUser {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.url);
  }

  getById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.url}/${id}`);
  }

  create(payload: Omit<IUser, 'id'>): Observable<IUser> {
    return this.http.post<IUser>(this.url, payload);
  }

  update(id: string, payload: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.url}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
