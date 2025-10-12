import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConvocationService, Convocation, User } from '../../../../../services/convocation.service';

@Component({
  selector: 'app-creer-convocations-c',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-convocations-c.html',
  styleUrls: ['./creer-convocations-c.css']
})
export class CreerConvocationsC implements OnInit {

  equipes: string[] = [
    'U6','U7','U8','U9','U10','U11','U12',
    'U13','U14','U15','U16','U17','U18','U23'
  ];

  convocation: Convocation = {
    match: '',
    equipe: '',
    joueurs: [],
    date: new Date(),
    lieu: '',
    mailCoach: '' // ✅ toujours défini
  };

  allJoueurs: (User & { action?: string })[] = [];
  composeJoueurs: (User & { action?: string })[] = [];
  joueursConvoques: (User & { action?: string })[] = [];

  showModal = false;
  showComposeModal = false;
  hideMainBtn = false;
  loading = false;
  successMsg = '';
  errorMsg = '';
  maxJoueurs = 5;
  currentUser: User | null = null;

  constructor(private convocationService: ConvocationService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadJoueurs();
  }

  loadCurrentUser(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
  
      // Remplir l'équipe automatiquement
      this.convocation.equipe = this.currentUser?.equipe ?? '';
  
      // ✅ Définir mailCoach avec l'email de l'utilisateur connecté
      if (this.currentUser?.email) {
        this.convocation.mailCoach = this.currentUser.email;
      } else {
        console.warn('Email du coach manquant dans localStorage !');
        this.convocation.mailCoach = ''; // fallback pour éviter undefined
      }
    }
  }
  

  loadJoueurs(): void {
    this.convocationService.getJoueurs().subscribe({
      next: users => {
        if (!this.currentUser) return;
        this.allJoueurs = users
          .filter(u => u.equipe === this.currentUser!.equipe)
          .map(u => ({ ...u, action: undefined }));
      },
      error: err => console.error(err)
    });
  }

  openModal(): void { 
    this.showModal = true; 
    this.hideMainBtn = true; 
  }
  
  closeModal(): void { 
    this.showModal = false; 
    this.showComposeModal = false; 
    this.hideMainBtn = false; 
    this.composeJoueurs = []; 
    this.allJoueurs.forEach(j => j.action = undefined); 
  }
  
  openComposeModal(): void { 
    this.showModal = false; 
    this.showComposeModal = true; 
  }
  
  closeComposeModal(): void { 
    this.showComposeModal = false; 
    this.showModal = true; 
  }

  ajouterJoueur(user: User & { action?: string }): void {
    if (this.composeJoueurs.length >= this.maxJoueurs) return;
    if (!this.composeJoueurs.find(j => j._id === user._id)) {
      user.action = 'ajoute';
      this.composeJoueurs.push(user);
    }
  }

  retirerJoueur(user: User & { action?: string }): void {
    user.action = undefined;
    this.composeJoueurs = this.composeJoueurs.filter(u => u._id !== user._id);
  }

  isJoueurCompose(user: User): boolean { 
    return this.composeJoueurs.some(j => j._id === user._id); 
  }

  validerCompo(): void {
    this.joueursConvoques = [...this.composeJoueurs];
    this.closeComposeModal();
  }

  validerConvocation(): void {
    if (this.joueursConvoques.length === 0) {
      this.errorMsg = 'Veuillez sélectionner au moins un joueur.';
      setTimeout(() => this.errorMsg = '', 1100);
      return;
    }
  
    this.convocation.joueurs = [...this.joueursConvoques];
  
    // ✅ Vérification que mailCoach est bien défini
    if (!this.convocation.mailCoach) {
      this.errorMsg = 'Impossible de créer la convocation : email du coach manquant.';
      setTimeout(() => this.errorMsg = '', 1500);
      return;
    }
  
    this.loading = true;
  
    this.convocationService.creerConvocation(this.convocation).subscribe({
      next: () => {
        this.successMsg = 'Convocation créée avec succès !';
        this.loading = false;
        this.closeModal();
        this.resetForm();
        setTimeout(() => this.successMsg = '', 1200);
      },
      error: err => {
        this.errorMsg = 'Erreur lors de la création.';
        console.error(err);
        this.loading = false;
        setTimeout(() => this.errorMsg = '', 1200);
      }
    });
  }
  

  private resetForm(): void {
    this.convocation = { 
      match: '', 
      equipe: this.currentUser?.equipe || '', 
      joueurs: [], 
      date: new Date(), 
      lieu: '', 
      mailCoach: this.currentUser?.email || '' // conserve l'email
    };
    this.composeJoueurs = [];
    this.joueursConvoques = [];
    this.allJoueurs.forEach(j => j.action = undefined);
  }
  

  getInitiale(user: User): string {
    return (user.prenom?.charAt(0) + user.nom?.charAt(0)).toUpperCase();
  }
}
