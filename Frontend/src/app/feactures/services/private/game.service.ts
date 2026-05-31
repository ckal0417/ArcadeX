import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../enviroment/enroment";
import { IGame } from "../../interfaces/public/Game";


@Injectable({providedIn: 'root'
})
export class ProductService {
  private url = `${environment.apiUrl}/games`;
  private http = inject(HttpClient);

  getProducts(): Observable<IGame> {
    return this.http.get<IGame>(this.url);
  }

  getById(id: number): Observable<IGame> {
    return this.http.get<IGame>(`${this.url}/${id}`);
  }

  create(payload: IGame): Observable<IGame> {
    return this.http.post<IGame>(this.url, payload);
  }

  update(id: number, payload: IGame): Observable<IGame> {
    return this.http.put<IGame>(`${this.url}/${id}`, payload);
  }

  delete(id: number): Observable<IGame> {
    return this.http.delete<IGame>(`${this.url}/${id}`);
  }

}
