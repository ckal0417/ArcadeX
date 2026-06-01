import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { IWishlistItem } from '../../interfaces/private/Wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private url = `${environment.apiUrl}/Wishlist`;
  private http = inject(HttpClient);

  getMine(): Observable<IWishlistItem[]> {
    return this.http.get<IWishlistItem[]>(`${this.url}/me`);
  }

  add(gameId: string): Observable<void> {
    return this.http.post<void>(`${this.url}/${gameId}`, {});
  }

  remove(gameId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${gameId}`);
  }
}
