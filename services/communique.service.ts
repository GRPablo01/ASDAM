// src/app/services/communique.service.ts
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
  liked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CommuniqueService {
  private apiUrl = 'http://localhost:3000/api/communiques';

  constructor(private http: HttpClient) {}

  /** Récupère tous les communiqués visibles */
  getCommuniques(): Observable<Communique[]> {
    return this.http.get<Communique[]>(this.apiUrl);
  }

  /** Récupère tous les communiqués d’un utilisateur spécifique */
  getUserCommuniques(userId: string): Observable<Communique[]> {
    return this.http.get<Communique[]>(`${this.apiUrl}/user/${userId}`);
  }

  /** Ajoute un nouveau communiqué (FormData requis pour inclure une image) */
  ajouterCommunique(communique: FormData): Observable<Communique> {
    return this.http.post<Communique>(this.apiUrl, communique);
  }

  /** Like un communiqué */
  likeCommunique(id: string): Observable<Communique> {
    return this.http.post<Communique>(`${this.apiUrl}/like/${id}`, {});
  }

  /** Dislike un communiqué */
  dislikeCommunique(id: string): Observable<Communique> {
    return this.http.post<Communique>(`${this.apiUrl}/dislike/${id}`, {});
  }

  /** Supprime un communiqué */
  supprimerCommunique(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
