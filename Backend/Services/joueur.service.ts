import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

/* =========================================================
   INTERFACE JOUEUR CLEAN
========================================================= */

export interface Joueur {
  _id:string;
  key:string;
  nom: string;
  prenom: string;
  email?: string;
  poste?: string;
  numero?: number;
  equipe?: string;
  role?: string;
  selected?: boolean;
  present: 'oui' | 'non' | 'non_repondu';
}

/* =========================================================
   SERVICE
========================================================= */

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  /* =========================================================
     🔥 GET ALL USERS RAW
  ========================================================= */

  private getAllUsersRaw(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /* =========================================================
     🔥 NORMALIZER (ANTI BUG)
  ========================================================= */

  private normalizeUser(user: any): Joueur {

    return {
      _id: user.id || user.id,
      key:user.key || user.key,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email,
      poste: user.poste,
      numero: user.numero,
      equipe: user.equipe,
      role: user.role || 'Joueur',
      present: user.present,
      selected: false
    };
  }

  /* =========================================================
     ⭐ GET ALL PLAYERS (ONLY JOUEURS)
  ========================================================= */

  getAllJoueurs(): Observable<Joueur[]> {
    return this.getAllUsersRaw().pipe(
      map(users =>
        (users || [])
          .filter(u => u.role?.toLowerCase() === 'joueur')
          .map(u => this.normalizeUser(u))
      )
    );
  }

  /* =========================================================
     ⭐ GET PLAYERS BY TEAM
  ========================================================= */

  getJoueursByEquipe(equipe: string): Observable<Joueur[]> {
    return this.getAllUsersRaw().pipe(
      map(users =>
        (users || [])
          .filter(u =>
            u.role?.toLowerCase() === 'joueur' &&
            u.equipe === equipe
          )
          .map(u => this.normalizeUser(u))
      )
    );
  }

  /* =========================================================
     ⭐ GET OTHER PLAYERS (IMPORTANT POUR TON UI)
  ========================================================= */

  getAutresJoueurs(equipe: string): Observable<Joueur[]> {
    return this.getAllUsersRaw().pipe(
      map(users =>
        (users || [])
          .filter(u =>
            u.role?.toLowerCase() === 'joueur' &&
            u.equipe !== equipe
          )
          .map(u => this.normalizeUser(u))
      )
    );
  }

  /* =========================================================
     ⭐ GET ALL USERS (ADMIN / DEBUG)
  ========================================================= */

  getAllUsers(): Observable<Joueur[]> {
    return this.getAllUsersRaw().pipe(
      map(users =>
        (users || []).map(u => this.normalizeUser(u))
      )
    );
  }
}