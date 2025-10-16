// src/app/services/classement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Export de l'interface pour utilisation dans le composant
export interface ClassementItem {
  categorie: string;
  Pl: number;
  Equipe: string;
  Pts: number;
  Jo: number;
  G: number;
  N: number;
  P: number;
  F: number;
  BP: number;
  BC: number;
  Pé: number;
  Dif: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassementService {
  private apiUrl = 'http://localhost:3000/api/classements'; // URL du backend

  constructor(private http: HttpClient) {}

  // Récupère tous les classements depuis le backend
  getClassements(): Observable<ClassementItem[]> {
    return this.http.get<ClassementItem[]>(this.apiUrl);
  }
}
