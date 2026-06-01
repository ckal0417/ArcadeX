import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enroment';
import { IReviewComment, ICreateReviewComment, IUpdateReviewComment } from '../../interfaces/private/ReviewComment';

@Injectable({ providedIn: 'root' })
export class ReviewCommentService {
  private url = `${environment.apiUrl}/ReviewComments`;
  private http = inject(HttpClient);

  getByReview(reviewId: string): Observable<IReviewComment[]> {
    return this.http.get<IReviewComment[]>(`${this.url}/review/${reviewId}`);
  }

  create(payload: ICreateReviewComment): Observable<IReviewComment> {
    return this.http.post<IReviewComment>(this.url, payload);
  }

  update(id: number, payload: IUpdateReviewComment): Observable<IReviewComment> {
    return this.http.put<IReviewComment>(`${this.url}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
