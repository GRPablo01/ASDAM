import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Actu {
  _id?: string;
  titre: string;
  description: string;
  image?: string;
  imageUrl?: string;
  auteur?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ActusService {
  private apiUrl = 'http://localhost:3000/api/actus';

  constructor(private http: HttpClient) {}

  createActus(data: FormData) {
    return this.http.post('http://localhost:3000/api/actus', data);
  }

  getAllActus(): Observable<Actu[]> {
    return this.http.get<Actu[]>(this.apiUrl);
  }

  deleteActus(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}