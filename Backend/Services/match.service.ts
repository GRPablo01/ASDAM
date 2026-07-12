import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Match2 {
  _id?: string;

  equipeDomicile: string;
  equipeExterieur: string;

  logoDom?: string;
  logoExt?: string;
  

  dateMatch: string;
  heureMatch?: string;

  stade?: string;
  localisationMatch?: string;

  scoreDomicile?: number;
  scoreExterieur?: number;

  enCours: boolean;
  statut?: 'programme' | 'en_cours' | 'termine';

  minutesEcoulees?: number;
  secondesEcoulees?: number;

  minute?: number;
  periode?: string;
  tempsAdditionnel?: number;

  compteRebours?: string;
  showInfos?: boolean;

  categorie?: string;
  typeMatch?: string;
  competition?: string;

  key?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private apiUrl = 'http://localhost:3000/api/matchs';

  constructor(private http: HttpClient) {}

  // ======================================================
  // 📥 GET ALL MATCHS (PROPRE)
  // ======================================================
  getMatches(): Observable<Match2[]> {
    return this.http.get<Match2[]>(this.apiUrl);
  }

  // ======================================================
  // ➕ CREATE MATCH
  // ======================================================
  createMatch(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }


  // ======================================================
// ✏️ UPDATE MATCH
// ======================================================
updateMatch(id: string, data: Partial<Match2>): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}

  // ======================================================
// 🔎 GET ONE MATCH BY ID
// ======================================================
getMatchById(id: string): Observable<Match2> {

  return this.http.get<Match2>(
    `${this.apiUrl}/${id}`
  );

} 

  // ======================================================
  // 🗑️ DELETE MATCH (CORRIGÉ)
  // ======================================================
  deleteMatch(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}