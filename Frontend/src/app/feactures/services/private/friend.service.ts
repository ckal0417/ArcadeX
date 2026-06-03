import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { FriendInterface } from '../../interfaces/private/Friend';

@Injectable({ providedIn: 'root' })
export class FriendService {
  private url = `${environment.apiUrl}/Friends`;
  private http = inject(HttpClient);

  getMine(): Observable<FriendInterface[]> {
    return this.http.get<FriendInterface[]>(`${this.url}/me`);
  }

  sendRequest(friendId: string): Observable<FriendInterface> {
    return this.http.post<FriendInterface>(`${this.url}/${friendId}`, {});
  }

  accept(friendId: string): Observable<FriendInterface> {
    return this.http.put<FriendInterface>(`${this.url}/${friendId}/accept`, {});
  }

  reject(friendId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${friendId}/reject`);
  }

  cancel(friendId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${friendId}/cancel`);
  }

  remove(friendId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${friendId}`);
  }
}