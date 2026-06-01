import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../enviroment/enroment";
import { IGame } from "../../interfaces/public/Game";


@Injectable({providedIn: 'root'
})
export class GameService {
  private url = `${environment.apiUrl}/games`;
  private http = inject(HttpClient);

  getAll(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.url);
  }

  getById(id: string): Observable<IGame> {
    return this.http.get<IGame>(`${this.url}/${id}`);
  }

  create(payload: Omit<IGame, 'id'>): Observable<IGame> {
    return this.http.post<IGame>(this.url, payload);
  }

  update(id: string, payload: Partial<IGame>): Observable<IGame> {
    return this.http.put<IGame>(`${this.url}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
