import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';

type Toast = { message: string; type: 'success' | 'error' };

@Component({
  selector: 'app-absent-j',
  templateUrl: './absent-j.html',
  styleUrls: ['./absent-j.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class AbsentJ implements OnInit {
  joueurs: User[] = [];
  utilisateurConnecte?: any;
  equipeFiltre = '';
  isDarkMode = false;
  toast: Toast | null = null;

  joursEntrainement: { [equipe: string]: string[] } = {
    U23: ['Mercredi', 'Vendredi'],
    U18: ['Mardi', 'Jeudi'],
  };

  presenceParJour: { [joueurId: string]: { [jour: string]: boolean } } = {};

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.loadUtilisateurConnecte();
    this.loadJoueurs();
    this.loadDarkMode();
  }

  loadUtilisateurConnecte() {
    const session = localStorage.getItem('utilisateur');
    if (session) {
      this.utilisateurConnecte = JSON.parse(session);
    }
  }

  loadJoueurs() {
    this.utilisateurService.getJoueurs().subscribe({
      next: (data) => {
        this.joueurs = this.utilisateurConnecte?.equipe
          ? data.filter(j => j.equipe === this.utilisateurConnecte.equipe)
          : [];

        const saved = localStorage.getItem('presenceParJour');
        if (saved) this.presenceParJour = JSON.parse(saved);

        this.joueurs.forEach(j => {
          const jours = this.joursEntrainement[j.equipe] || [];
          if (!this.presenceParJour[j.id]) this.presenceParJour[j.id] = {};
          jours.forEach(jour => {
            if (this.presenceParJour[j.id][jour] === undefined) {
              this.presenceParJour[j.id][jour] = true;
            }
          });
        });

        this.savePresence();
      },
      error: () => this.showToast('Erreur lors du chargement des joueurs.', 'error')
    });
  }

  getJours(equipe: string): string[] {
    return this.joursEntrainement[equipe] || [];
  }

  savePresence() {
    localStorage.setItem('presenceParJour', JSON.stringify(this.presenceParJour));
  }

  getPresenceCount(joueurId: string) {
    const jours = this.presenceParJour[joueurId] || {};
    let present = 0, absent = 0;
    Object.values(jours).forEach(v => v ? present++ : absent++);
    return { present, absent };
  }

  getJoueursParEquipeFiltre() {
    const groupes: { [key: string]: User[] } = {};
    const joueurs = this.equipeFiltre
      ? this.joueurs.filter(j => j.equipe === this.equipeFiltre)
      : this.joueurs;

    joueurs.forEach(j => {
      const eq = j.equipe || 'Non défini';
      if (!groupes[eq]) groupes[eq] = [];
      groupes[eq].push(j);
    });

    return Object.keys(groupes).map(eq => ({ equipe: eq, joueurs: groupes[eq] }));
  }

  getEquipes(): string[] {
    return [...new Set(this.joueurs.map(j => j.equipe))];
  }

  peutModifier(joueurId: string): boolean {
    const role = this.utilisateurConnecte?.role;
    return ['coach', 'admin', 'superadmin'].includes(role) || joueurId === this.utilisateurConnecte._id;
  }

  confirmSetPresence(joueurId: string, jour: string, present: boolean) {
    if (this.utilisateurConnecte?.role === 'joueur' && joueurId === this.utilisateurConnecte._id) {
      const confirmed = confirm(`Confirmer votre présence pour ${jour} ?`);
      if (!confirmed) return;
    }
    this.setPresence(joueurId, jour, present);
  }

  setPresence(joueurId: string, jour: string, present: boolean) {
    if (!this.presenceParJour[joueurId]) this.presenceParJour[joueurId] = {};
    this.presenceParJour[joueurId][jour] = present;
    this.savePresence();
    this.showToast('Présence mise à jour.', 'success');
  }

  get resumeGlobal() {
    let present = 0, absent = 0;
    this.joueurs.forEach(j => {
      const counts = this.getPresenceCount(j.id);
      present += counts.present;
      absent += counts.absent;
    });
    return { present, absent, total: this.joueurs.length };
  }

  exportCSV() {
    const rows: string[] = ['Nom,Prenom,Equipe,Jour,Present'];
    this.joueurs.forEach(j => {
      this.getJours(j.equipe).forEach(jour => {
        const present = this.presenceParJour[j.id]?.[jour] ? 'Oui' : 'Non';
        rows.push(`${j.nom},${j.prenom},${j.equipe},${jour},${present}`);
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presences.csv';
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Export CSV réussi.', 'success');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  loadDarkMode() {
    const saved = localStorage.getItem('darkMode');
    this.isDarkMode = saved ? JSON.parse(saved) : false;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  roleBadgeClass(role?: string): string {
    switch (role) {
      case 'joueur': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'coach': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'admin':
      case 'superadmin': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  filtrerParEquipe() {
    // Déclenche le filtre via getter
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }
}