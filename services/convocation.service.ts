import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/userService/Auth.Service'; 

export interface User {
  _id?: string;
  nom: string;
  prenom: string;
  email?: string;
  equipe?: string;
  role?: string;
  etatPresence?: 'present' | 'absent';
  hasClicked?: boolean;
  hasClickedConv?: { [convId: string]: boolean };
}

export interface Convocation {
  _id?: string;
  match: string;
  equipe: string;
  joueurs: User[];
  date: Date | string;
  lieu: string;
  statut?: 'en attente' | 'confirmé' | 'annulé';
  mailCoach?: string;
  coachEmail?: string; 
  retryLoading?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConvocationService {
  private apiUrl = 'http://localhost:3000/api/convocations';
  private usersUrl = 'http://localhost:3000/api/utilisateurs';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Créer une convocation
  creerConvocation(convocation: Convocation): Observable<Convocation> {
    const mailCoach = this.authService.getUser()?.email;
    const payload = {
      ...convocation,
      joueurs: convocation.joueurs.map(j => ({ _id: j._id, nom: j.nom, prenom: j.prenom })),
      date: convocation.date instanceof Date ? convocation.date.toISOString() : convocation.date,
      mailCoach
    };
    return this.http.post<Convocation>(this.apiUrl, payload);
  }

  // Récupérer toutes les convocations
  getConvocations(): Observable<Convocation[]> {
    return this.http.get<Convocation[]>(this.apiUrl);
  }

  // Récupérer uniquement les joueurs
  getJoueurs(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      map(users => users.filter(u => u.role === 'joueur'))
    );
  }

  // Convocation du joueur connecté seulement
  getMaConvocation(): Observable<Convocation | null> {
    return this.http.get<Convocation>(`${this.apiUrl}/moi`);
  }

  // Mettre à jour la présence d'un joueur
  updatePresence(convId: string, joueurId: string, present: boolean): Observable<Convocation> {
    // URL PATCH corrigée et sécurisée
    return this.http.patch<Convocation>(`${this.apiUrl}/${convId}/presence`, { joueurId, present });
  }

  
  
}
