// src/app/services/match.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ------------------- INTERFACE MATCH -------------------
export interface Match {
  _id?: string;
  equipeA: string;
  equipeB: string;
  date: string;         // date complète ISO
  heureDebut?: string; // nouvelle propriété : heure de début "HH:mm"
  heureFin?: string;    // nouvelle propriété : heure de fin "HH:mm"
  lieu: string;
  categorie: string;
  typeMatch?: 'Championnat' | 'Tournoi' | 'Amical' | 'Coup';
  scoreA?: number;
  scoreB?: number;
  logoA?: string;
  logoB?: string;
  arbitre?: string;
  stade?: string;
  status?: 'A venir' | 'En directe' | 'Terminer';
  duree?: number;       // durée en minutes
  minute?: number;
  opponent: string;   
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:3000/api/matches'; // URL de l’API backend

  constructor(private http: HttpClient) {}

  // ------------------- CRÉER UN MATCH -------------------
  creerMatch(match: Match, headers?: HttpHeaders): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match, { headers });
  }

  // ------------------- RÉCUPÉRER TOUS LES MATCHS -------------------
  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  // ------------------- METTRE À JOUR LE SCORE -------------------
  updateScore(id: string, scoreA: number, scoreB: number, headers?: HttpHeaders): Observable<Match> {
    return this.http.patch<Match>(
      `${this.apiUrl}/${id}`,
      { scoreA, scoreB },
      { headers }
    );
  }

  // ------------------- MÉTHODE GÉNÉRIQUE POUR MISE À JOUR -------------------
  updateMatch(id: string, payload: Partial<Match>, headers?: HttpHeaders): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${id}`, payload, { headers });
  }

  // ------------------- SUPPRIMER UN MATCH -------------------
  deleteMatch(id: string, headers?: HttpHeaders): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
