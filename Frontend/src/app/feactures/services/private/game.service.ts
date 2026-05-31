import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../enviroment/enroment";
import { IGame, IResponseGames } from "../../interfaces/public/Game";


@Injectable({providedIn: 'root'
})
export class GameService {
  private url = `${environment.apiUrl}/games`;
  private http = inject(HttpClient);

  get(): Observable<IResponseGames> {
    return this.http.get<IResponseGames>(this.url);
  }

  getById(id: number): Observable<IResponseGames> {
    return this.http.get<IResponseGames>(`${this.url}/${id}`);
  }

  create(payload: IGame): Observable<IResponseGames> {
    return this.http.post<IResponseGames>(this.url, payload);
  }

  update(id: number, payload: IResponseGames): Observable<IResponseGames> {
    return this.http.put<IResponseGames>(`${this.url}/${id}`, payload);
  }

  delete(id: string): Observable<IGame> {
    return this.http.delete<IGame>(`${this.url}/${id}`);
  }

}
