import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==========================================
// INTERFACE CLASSEMENT
// ==========================================

export interface ClassementEntry {
  position: number;
  equipe: string;
  logo?: string;
  joues: number;
  gagnes: number;
  nuls: number;
  perdus: number;
  bp: number;
  bc: number;
  diff: number;
  points: number;
  forme: string[];
}

export interface Classement {
  _id?: string;
  categorie: string;
  saison: string;
  dateGeneration: string;
  entries: ClassementEntry[];
  totalMatchs: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassementService {

  apiUrl = 'http://localhost:3000/api/classement';

  constructor(private http: HttpClient) {}

  // ==========================================
  // RÉCUPÉRER LE CLASSEMENT D'UNE CATÉGORIE
  // ==========================================

  getClassement(categorie: string): Observable<Classement> {

    console.log('📤 Récupération classement :', categorie);

    return this.http.get<Classement>(`${this.apiUrl}/${categorie}`);

  }

  // ==========================================
  // HISTORIQUE DU CLASSEMENT
  // ==========================================

  getHistorique(categorie: string): Observable<Classement[]> {

    console.log('📤 Récupération historique :', categorie);

    return this.http.get<Classement[]>(`${this.apiUrl}/${categorie}/historique`);

  }

  // ==========================================
  // FORCER LA GÉNÉRATION (ADMIN)
  // ==========================================

  genererClassement(categorie: string): Observable<Classement> {

    console.log('📤 Génération classement :', categorie);

    return this.http.post<Classement>(`${this.apiUrl}/${categorie}/generer`, {});

  }

}