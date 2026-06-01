import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { IGameSession, IStartGameSession } from '../../interfaces/private/GameSession';

@Injectable({ providedIn: 'root' })
export class GameSessionService {
  private url = `${environment.apiUrl}/GameSessions`;
  private http = inject(HttpClient);

  getMine(): Observable<IGameSession[]> {
    return this.http.get<IGameSession[]>(`${this.url}/me`);
  }

  start(payload: IStartGameSession): Observable<IGameSession> {
    return this.http.post<IGameSession>(`${this.url}/start`, payload);
  }

  end(sessionId: string): Observable<void> {
    return this.http.put<void>(`${this.url}/${sessionId}/end`, {});
  }
}
