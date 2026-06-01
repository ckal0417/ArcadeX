import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IOffert, IResponseOfferts } from '../../interfaces/private/Offert';
import { environment } from '../../../../enviroment/enroment';

@Injectable({
  providedIn: 'root'
})
export class OffertService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Offers`;

  getAll() {
    return this.http.get<IResponseOfferts>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<IOffert>(`${this.apiUrl}/${id}`);
  }

  create(offert: Partial<IOffert>) {
    return this.http.post<IOffert>(this.apiUrl, offert);
  }

  update(id: string, offert: Partial<IOffert>) {
    return this.http.put<IOffert>(`${this.apiUrl}/${id}`, offert);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
