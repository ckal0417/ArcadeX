import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { IReview, ICreateReview, IUpdateReview } from '../../interfaces/private/Review';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private url = `${environment.apiUrl}/Reviews`;
  private http = inject(HttpClient);

  getAll(): Observable<IReview[]> {
    return this.http.get<IReview[]>(this.url);
  }

  getById(id: string): Observable<IReview> {
    return this.http.get<IReview>(`${this.url}/${id}`);
  }

  getByGame(gameId: string): Observable<IReview[]> {
    return this.http.get<IReview[]>(`${this.url}/game/${gameId}`);
  }

  create(payload: ICreateReview): Observable<IReview> {
    return this.http.post<IReview>(this.url, payload);
  }

  update(id: string, payload: IUpdateReview): Observable<IReview> {
    return this.http.put<IReview>(`${this.url}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
