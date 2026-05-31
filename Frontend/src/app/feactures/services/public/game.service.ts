import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../enviroment/enroment";
import { HttpClient } from "@angular/common/http";
import { IGame } from "../../interfaces/public/Game";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class GamesService {
  private url = `${environment.apiUrl}/games`;
  private http = inject(HttpClient);

  getGames(): Observable<IGame> {
    return this.http.get<IGame>(this.url);
  }
}
