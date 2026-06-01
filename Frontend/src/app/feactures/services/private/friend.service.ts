import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { IFriend } from '../../interfaces/private/Friend';

@Injectable({ providedIn: 'root' })
export class FriendService {
  private url = `${environment.apiUrl}/Friends`;
  private http = inject(HttpClient);

  getMine(): Observable<IFriend[]> {
    return this.http.get<IFriend[]>(`${this.url}/me`);
  }

  sendRequest(friendId: string): Observable<void> {
    return this.http.post<void>(`${this.url}/${friendId}`, {});
  }

  accept(friendId: string): Observable<void> {
    return this.http.put<void>(`${this.url}/${friendId}/accept`, {});
  }

  remove(friendId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${friendId}`);
  }
}
