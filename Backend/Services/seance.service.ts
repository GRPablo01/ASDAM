import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Seance {

  _id?: string;

  titre: string;

  description: string;

  date: string;

  heure: string;

  lieu: string;

  categorie?: string;

  // ✅ Équipe concernée par la séance
  equipe:
    | 'U6'
    | 'U7'
    | 'U8'
    | 'U9'
    | 'U10'
    | 'U11'
    | 'U12'
    | 'U13'
    | 'U13F'
    | 'U18'
    | 'U23'
    | 'SeniorA'
    | 'SeniorB'
    | 'SeniorD'
    | 'ALL';


  createdBy?: string;

  createdAt?: string;

  updatedAt?: string;

  // Joueurs présents
  joueursPresent?: string[];


  // Joueurs absents
  joueursNonPresent?: string[];

}



@Injectable({
  providedIn: 'root'
})
export class SeanceService {


  private apiUrl = 'http://localhost:3000/api/seances';



  constructor(
    private http: HttpClient
  ) {}



  // ==========================================
  // CREER UNE SEANCE
  // ==========================================
  createSeance(seance: Seance): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/create`,
      seance
    );

  }



  // ==========================================
  // RECUPERER TOUTES LES SEANCES
  // ==========================================
  getSeances(): Observable<Seance[]> {

    return this.http.get<Seance[]>(
      this.apiUrl
    );

  }



  // ==========================================
  // RECUPERER UNE SEANCE
  // ==========================================
  getSeanceById(id: string): Observable<Seance> {

    return this.http.get<Seance>(
      `${this.apiUrl}/${id}`
    );

  }



  // ==========================================
  // MODIFIER UNE SEANCE
  // ==========================================
  updateSeance(
    id: string,
    seance: Seance
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      seance
    );

  }



  // ==========================================
  // SUPPRIMER UNE SEANCE
  // ==========================================
  deleteSeance(id: string): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }


}