// src/app/services/match.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Match {
  _id?: string;
  equipeA: string;
  equipeB: string;
  date: string;
  lieu: string;
  categorie: string;
  typeMatch?: 'Championnat' | 'Tournoi' | 'Amical' | 'Coup';
  scoreA?: number;
  scoreB?: number;
  logoA?: string;
  logoB?: string;
  arbitre?: string;
  stade?: string;
  status?: 'scheduled' | 'live' | 'finished';
  duree?: number;
  minute?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:3000/api/matches';

  constructor(private http: HttpClient) {}

  creerMatch(match: Match): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }
  
  updateScore(id: string, scoreA: number, scoreB: number, headers?: any): Observable<Match> {
    return this.http.patch<Match>(
      `${this.apiUrl}/matches/${id}`,
      { scoreA, scoreB },
      { headers }
    );
  }
  
  

  // méthode générique pour mettre à jour d'autres champs si besoin
  updateMatch(id: string, payload: Partial<Match>): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${id}`, payload);
  }
}
