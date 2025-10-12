import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private utilisateur: any = null;

  constructor() {
    const data = localStorage.getItem('utilisateur');
    if (data) this.utilisateur = JSON.parse(data);
  }

  // ✅ Sauvegarde complète avec équipe
  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  getUser() {
    return this.utilisateur;
  }

  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }

  isLoggedIn(): boolean {
    return !!this.utilisateur;
  }

  getUserRole(): string {
    return this.utilisateur?.role?.trim().toLowerCase() || '';
  }
}
