import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Icon } from '../../component/icon/icon';
import { AuthService } from '../../../services/userService/Auth.Service';

interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  codeCoach?: string;
  codeJoueur?: string;
  codeAdmin?: string;
  codeSuperAdmin?: string;
  equipe: string;
  role: 'joueur' | 'coach' | 'inviter' | 'admin' | 'super admin';
  initiale?: string;
  cguValide: boolean;
  [key: string]: any; 
}

interface RoleOption {
  label: string;
  value: 'joueur' | 'coach' | 'inviter' | 'admin' | 'super admin';
  icon: string;
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Icon, RouterLink],
  templateUrl: './inscription.html',
})
export class Inscription implements OnInit, OnDestroy {
  actif: 'joueur' | 'coach' | 'inviter' | 'admin' | 'super admin' = 'joueur';
  etape: 1 | 2 = 1;

  readonly CODE_COACH = 'COACH2025';
  readonly CODE_JOUEUR = 'JOUEUR2025';
  readonly CODE_ADMIN = 'ADMIN2025';
  readonly CODE_SUPERADMIN = 'SUPERADMIN2025';

  equipes: string[] = [
    'U7','U9','U11','U13','U15','U18', 'U23', 'SeniorA', 'SeniorB','SeniorD'
  ];

  // ✅ Liste des rôles pour la boucle *ngFor dans le HTML
  roles: RoleOption[] = [
    { label: 'Joueur', value: 'joueur', icon: 'fa-futbol' },
    { label: 'Coach', value: 'coach', icon: 'fa-chalkboard-teacher' },
    { label: 'Admin', value: 'admin', icon: 'fa-user-shield' },
    { label: 'Invité', value: 'inviter', icon: 'fa-user' },
  ];

  inscriptionData: InscriptionData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    codeCoach: '',
    codeJoueur: '',
    codeAdmin: '',
    codeSuperAdmin: '',
    equipe: '',
    role: 'joueur',
    initiale: '',
    cguValide: false,
  };

  passwordVisible = false;
  formSubmitted = false;
  message: string | null = null;
  cguAccepte = false;
  showCode = false;

  

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  // 🔹 Sélection d’un rôle
  choisirRole(role: 'joueur' | 'coach' | 'inviter' | 'admin' | 'super admin'): void {
    this.actif = role;
    this.inscriptionData.role = role;
    this.inscriptionData.equipe = '';

    switch (role) {
      case 'joueur':
        this.inscriptionData.codeJoueur = '';
        break;
      case 'coach':
        this.inscriptionData.codeCoach = '';
        break;
      case 'admin':
        this.inscriptionData.codeAdmin = '';
        break;
      case 'super admin':
        this.inscriptionData.codeSuperAdmin = '';
        break;
    }

    if (role === 'coach' || role === 'joueur') {
      this.inscriptionData.equipe = this.equipes[0];
    } else if (role === 'admin' || role === 'super admin') {
      this.inscriptionData.equipe = 'Tous';
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  isEmailValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  etape1Valide(): boolean {
    return !!this.inscriptionData.nom &&
           !!this.inscriptionData.prenom &&
           this.isEmailValid(this.inscriptionData.email) &&
           !!this.inscriptionData.password &&
           this.inscriptionData.password.length >= 6;
  }

  etape2Valide(): boolean {
    const { actif, inscriptionData } = this;

    if ((actif === 'coach' && inscriptionData.codeCoach !== this.CODE_COACH) ||
        (actif === 'joueur' && inscriptionData.codeJoueur !== this.CODE_JOUEUR) ||
        (actif === 'admin' && inscriptionData.codeAdmin !== this.CODE_ADMIN) ||
        (actif === 'super admin' && inscriptionData.codeSuperAdmin !== this.CODE_SUPERADMIN)) {
      return false;
    }

    if ((actif === 'coach' || actif === 'joueur') && !inscriptionData.equipe) return false;

    return this.cguAccepte;
  }

  etapeSuivante(): void {
    if (this.etape1Valide()) {
      this.etape = 2;
    } else {
      alert('Veuillez remplir correctement tous les champs obligatoires.');
    }
  }

  etapePrecedente(): void {
    this.etape = 1;
  }

  valider(): void {
    if (!this.etape2Valide()) {
      alert('Veuillez remplir correctement tous les champs et accepter les CGU.');
      return;
    }

    const initiale =
      (this.inscriptionData.prenom[0] ?? '').toUpperCase() +
      (this.inscriptionData.nom[0] ?? '').toUpperCase();

    const payload: InscriptionData = {
      ...this.inscriptionData,
      initiale,
      cguValide: this.cguAccepte,
    };

    // Nettoyage selon le rôle
    if (payload.role !== 'coach') delete payload.codeCoach;
    if (payload.role !== 'joueur') delete payload.codeJoueur;
    if (payload.role !== 'admin') delete payload.codeAdmin;
    if (payload.role !== 'super admin') delete payload.codeSuperAdmin;

    this.http.post('http://localhost:3000/api/users', payload).subscribe({
      next: (res: any) => {
        this.message = `Bienvenue sur Asdam !`;
        this.authService.setUser(res);

        const redirection =
          payload.role === 'coach'        ? '/accueilC' :
          payload.role === 'admin'        ? '/accueilA' :
          payload.role === 'super admin'  ? '/accueilS' :
          payload.role === 'joueur'       ? '/accueilJ' :
          payload.role === 'inviter'      ? '/accueilI' :
          '/';

        setTimeout(() => this.router.navigate([redirection]), 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte', err);
        this.message = '⚠️ Erreur lors de la création du compte.';
      }
    });
  }
}
