import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Communique {
  _id?: string;
  titre: string;
  contenu: string;
  auteur: string;
  tags: string[];
  image?: string;
  visible: boolean;
  likes: number;
  date: Date;
}

@Injectable({ providedIn: 'root' })
export class CommuniqueService {
  private apiUrl = 'http://localhost:3000/api/communiques';

  constructor(private http: HttpClient) {}

  getCommuniques(): Observable<Communique[]> {
    return this.http.get<Communique[]>(this.apiUrl);
  }

  ajouterCommunique(communique: FormData): Observable<Communique> {
    return this.http.post<Communique>(this.apiUrl, communique);
  }

  likeCommunique(id: string): Observable<Communique> {
    return this.http.post<Communique>(`${this.apiUrl}/like/${id}`, {});
  }

  dislikeCommunique(id: string): Observable<Communique> {
    return this.http.post<Communique>(`${this.apiUrl}/dislike/${id}`, {});
  }
}