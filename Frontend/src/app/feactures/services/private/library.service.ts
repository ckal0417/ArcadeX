import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { ILibraryItem } from '../../interfaces/private/Library';

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private url = `${environment.apiUrl}/Library`;
  private http = inject(HttpClient);

  getMine(): Observable<ILibraryItem[]> {
    return this.http.get<ILibraryItem[]>(`${this.url}/me`);
  }

  addGame(gameId: string): Observable<void> {
    return this.http.post<void>(`${this.url}/${gameId}`, {});
  }
}
