import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private utilisateur: {
    _id: string;
    prenom: string;
    nom: string;
    email: string;
    role: string;
    initiale: string;
    equipe?: string; // ✅ ajouté
    categorie?: string; 
    poste?: string;
  } | null = null;

  constructor() {
    const data = localStorage.getItem('utilisateur');
    if (data) this.utilisateur = JSON.parse(data);
  }

  getInitiales(): string {
    return this.utilisateur?.initiale || 'IN';
  }

  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }

  getUser() {
    return this.utilisateur;
  }

  getNomComplet(): string {
    return this.utilisateur ? `${this.utilisateur.prenom} ${this.utilisateur.nom}` : 'Invité';
  }
}
