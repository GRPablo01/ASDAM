// services/categorie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categorie {
  _id: string;
  categorie: string;
  joueur: any[];
}

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private apiUrl = 'http://localhost:5000/api/categories'; // adapte selon ton port

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>('http://localhost:3000/api/categories');
  }
  

  // ✅ Méthode pour mettre à jour les joueurs d’une catégorie
  updateCategorieJoueurs(id: string, joueurs: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/joueurs`, { joueurs });
  }
}
