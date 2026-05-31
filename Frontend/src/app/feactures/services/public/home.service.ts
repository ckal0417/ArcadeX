import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../enviroment/enroment";
import { HttpClient } from "@angular/common/http";
import { IGame, IResponseGames } from "../../interfaces/public/Game";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class HomeService {
  private url = `${environment.apiUrl}/games`;
  private http = inject(HttpClient);

  getGames(): Observable<IResponseGames> {
    return this.http.get<IResponseGames>(this.url);
  }
}
