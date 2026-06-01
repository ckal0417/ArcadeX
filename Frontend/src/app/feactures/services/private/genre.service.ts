import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { IGenre, ICreateGenre } from '../../interfaces/private/Genre';

@Injectable({ providedIn: 'root' })
export class GenreService {
  private url = `${environment.apiUrl}/Genres`;
  private http = inject(HttpClient);

  getAll(): Observable<IGenre[]> {
    return this.http.get<IGenre[]>(this.url);
  }

  create(payload: ICreateGenre): Observable<IGenre> {
    return this.http.post<IGenre>(this.url, payload);
  }
}
