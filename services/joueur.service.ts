import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from './userService/utilisateur.service';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  private apiUrl = 'http://localhost:3000/api/users'; // URL de ton API pour tous les utilisateurs

  constructor(private http: HttpClient) {}

  /**
   * Récupère uniquement les utilisateurs ayant le rôle "joueur"
   */
  getJoueurs(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.filter(u => u.role?.toLowerCase() === 'joueur'))
    );
  }
}
