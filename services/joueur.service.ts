import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from './userService/utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  // Ici on prend l'endpoint qui renvoie tous les utilisateurs
  private apiUrl = 'http://localhost:3000/api/users/joueurs';

  constructor(private http: HttpClient) {}

  /**
   * Récupère uniquement les utilisateurs ayant le rôle "joueur"
   */
  getJoueurs(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl); // renvoie déjà que les joueurs
  }
  
}
