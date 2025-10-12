import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  initiale: string;
  club: string;
  equipe: string;
  membreDepuis: Date;
  role: string;
  photoURL?: string;
  joueurs?: any[];
  categorie?: string; 
  poste?: string;
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private joueursUrl = 'http://localhost:3000/api/joueurs';
  private apiUrl = 'http://localhost:3000/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());

  constructor(private http: HttpClient) {}

  // =========================
  // Récupération de l'utilisateur depuis le localStorage
  // =========================
  private getUserFromLocalStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      const userObj = JSON.parse(userStr);
      const initiale = userObj.initiale ??
        ((userObj.prenom?.[0] ?? '') + (userObj.nom?.[0] ?? '')).toUpperCase();

      return {
        id: userObj.id ?? '',
        prenom: userObj.prenom ?? '',
        nom: userObj.nom ?? '',
        role: userObj.role ?? '',
        initiale,
        email: userObj.email ?? '',
        club: userObj.club ?? '',
        equipe: userObj.equipe ?? '',
        joueurs: userObj.joueurs ?? [],
        membreDepuis: userObj.membreDepuis ? new Date(userObj.membreDepuis) : new Date(),
        photoURL: userObj.photoURL ?? ''
      };
    } catch (err) {
      console.error('Erreur lors de la lecture de l’utilisateur depuis le localStorage', err);
      return null;
    }
  }

  // =========================
  // Observables pour l'utilisateur courant
  // =========================
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return of(this.currentUserSubject.value);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  clearCurrentUser(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // =========================
  // API: utilisateurs et joueurs
  // =========================
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.filter(u => u.role === 'joueur'))
    );
  }

  getJoueurs(): Observable<User[]> {
    return this.http.get<User[]>(this.joueursUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  updateUser(userId: string, data: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, data);
  }
  
}
