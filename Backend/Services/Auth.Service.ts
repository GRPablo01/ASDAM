import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  firstValueFrom,
  Observable,
  switchMap,
  map
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private utilisateur: any = null;

  private apiUrl = 'http://localhost:3000/api/users';
  private authUrl = 'http://localhost:3000/api/auth';
  private logUrl = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) {

    console.log('🚀 AuthService initialisé');

    const data = localStorage.getItem('utilisateur');

    if (data) {
      this.utilisateur = JSON.parse(data);
      console.log('👤 Utilisateur chargé depuis localStorage :', this.utilisateur);
    } else {
      console.log('⚠️ Aucun utilisateur dans localStorage');
    }
  }

  // ==========================
  // CURRENT USER
  // ==========================
  private getCurrentUser() {
    return this.utilisateur || JSON.parse(localStorage.getItem('utilisateur') || '{}');
  }

  // ==========================
  // SET USER
  // ==========================
  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  // ==========================
  // GET USER
  // ==========================
  getUser() {
    return this.utilisateur;
  }

  // ==========================
  // CLEAR USER
  // ==========================
  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }

  // ==========================
  // IS LOGGED
  // ==========================
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // ==========================
  // ROLE
  // ==========================
  getUserRole(): string {
    return this.getCurrentUser()?.role?.trim()?.toLowerCase() || '';
  }

  // ==========================
  // RESET LINK
  // ==========================
  envoyerLienReinitialisation(email: string) {
    return firstValueFrom(
      this.http.post(`${this.apiUrl}/reset-link`, { email })
    );
  }

  // ==========================
  // RESET PASSWORD
  // ==========================
  async reinitialiserMotDePasse(email: string, password: string) {
    return fetch(`${this.authUrl}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  }

  // ==========================
  // CONFIRM RESET
  // ==========================
  confirmerResetMotDePasse(token: string, motDePasse: string) {
    return this.http.post(
      `${this.apiUrl}/reset-link/confirm`,
      { token, password: motDePasse }
    ).toPromise();
  }

  // ==========================
  // USERS
  // ==========================
  getAllUsers() {
    return this.http.get(`${this.authUrl}/users`);
  }

  // 👉 lecture par ID backend
  getUserById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 👉 lecture par KEY (IMPORTANT)
  getUserByKey(key: string) {
    return this.http.get(`${this.apiUrl}/key/${key}`);
  }

  // 👉 update par KEY
  updateUserByKey(key: string, data: any) {
    return this.http.put(`${this.authUrl}/key/${key}`, data);
  }

  // ==========================
  // FOLLOW + LOG
  // ==========================
  ajouterSuivie(followKey: string): Observable<any> {

    const currentUser = this.getCurrentUser();

    if (!currentUser?.key) {
      throw new Error('Utilisateur non connecté');
    }

    return this.http.put(`${this.apiUrl}/follow`, {
      myKey: currentUser.key,
      followKey
    }).pipe(

      switchMap((response: any) => {

        const logData = {
          user: `${currentUser.prenom || ''} ${currentUser.nom || ''}`,
          role: currentUser.role || 'unknown',
          action: 'FOLLOW_USER',
          description: 'Ajout d’un suivi utilisateur',
          type: 'UPDATE',
          field: 'follow',
          newValue: { followKey },
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => response)
        );
      })
    );
  }


  // ==========================
  // UPDATE USER + LOG (ID ONLY)
  // ==========================
  updateUser(id: string, data: any): Observable<any> {

    // ==========================
    // CHECK ID
    // ==========================

    if (!id) {
      throw new Error('ID manquant');
    }

    console.log('===================================');
    console.log('🔥 UPDATE USER');
    console.log('===================================');

    console.log('🆔 ID :', id);

    console.log('📤 DATA :', data);

    // ==========================
    // UPDATE USER
    // ==========================

    return this.http.put(

      `${this.authUrl}/${id}`,
      data

    ).pipe(

      switchMap((updatedUser: any) => {

        const currentUser = this.getCurrentUser();

        // ==========================
        // LOG DATA
        // ==========================

        const logData = {

          user:
            `${currentUser.prenom || ''} ` +
            `${currentUser.nom || ''}`,

          role: currentUser.role || 'unknown',

          action: 'UPDATE_USER',

          description: 'Modification utilisateur',

          type: 'UPDATE',

          field: 'user',

          newValue: {

            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            role: data.role

          },

          date: new Date()
        };

        // ==========================
        // SAVE LOG
        // ==========================

        return this.http.post(

          this.logUrl,
          logData

        ).pipe(

          map(() => updatedUser)

        );
      })
    );
  }

  // ==========================
  // DELETE USER (KEY ONLY)
  // ==========================
  deleteUser(key: string): Observable<any> {

    if (!key) {
      throw new Error('KEY manquante');
    }

    const currentUser = this.getCurrentUser();

    const url = `${this.authUrl}/key/${key}`;

    return this.http.delete(url).pipe(

      switchMap((deletedUser: any) => {

        const logData = {
          user: `${currentUser?.prenom || ''} ${currentUser?.nom || ''}`,
          role: currentUser?.role || 'unknown',
          action: 'DELETE_USER',
          description: 'Suppression utilisateur',
          type: 'DELETE',
          field: 'user',
          oldValue: {
            deletedKey: key
          },
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => deletedUser)
        );
      })
    );
  }
}