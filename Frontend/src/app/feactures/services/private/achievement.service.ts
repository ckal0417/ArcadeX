import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { IAchievement, ICreateAchievement } from '../../interfaces/private/Achievement';

@Injectable({ providedIn: 'root' })
export class AchievementService {
  private url = `${environment.apiUrl}/Achievements`;
  private http = inject(HttpClient);

  getByGame(gameId: string): Observable<IAchievement[]> {
    return this.http.get<IAchievement[]>(`${this.url}/game/${gameId}`);
  }

  getMine(): Observable<IAchievement[]> {
    return this.http.get<IAchievement[]>(`${this.url}/me`);
  }

  create(payload: ICreateAchievement): Observable<IAchievement> {
    return this.http.post<IAchievement>(this.url, payload);
  }

  unlock(achievementId: string): Observable<void> {
    return this.http.post<void>(`${this.url}/${achievementId}/unlock`, {});
  }
}
