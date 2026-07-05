import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Joueur, JoueurService } from '../../../../../Backend/Services/joueur.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team implements OnInit {

  joueurs: Joueur[] = [];
  filteredJoueurs: Joueur[] = [];

  searchQuery = '';
  isLoading = false;

  openMenuId: string | null = null;

  statusFilters = [
    { label: 'Tous', value: 'tous' },
    { label: 'Disponibles', value: 'disponible' },
    { label: 'Indisponibles', value: 'indisponible' },
    { label: 'Blessés', value: 'blessé' },
    { label: 'Suspendus', value: 'suspendu' },
  ];

  activeStatusFilter: string = 'tous';

  nextMatchOpponent: string = '';
  nextMatchDate: string = '';

  equipeCoach = '';

  constructor(
    private joueurService: JoueurService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCoachEquipe();
    this.loadJoueurs();
  }

  getCoachEquipe(): void {
    const user = localStorage.getItem('utilisateur');
    if (!user) return;

    const parsed = JSON.parse(user);
    this.equipeCoach = parsed.equipe;
  }

  loadJoueurs(): void {
    this.isLoading = true;

    this.joueurService.getAllJoueurs().subscribe({
      next: (data) => {
        this.joueurs = data.filter(j => j.equipe === this.equipeCoach);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  setStatusFilter(value: string): void {
    this.activeStatusFilter = value;
    this.applyFilters();
  }

  applyFilters(): void {

    let result = [...this.joueurs];

    // SEARCH
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();

      result = result.filter(j =>
        j.prenom?.toLowerCase().includes(q) ||
        j.nom?.toLowerCase().includes(q) ||
        j.email?.toLowerCase().includes(q) ||
        j.poste?.toLowerCase().includes(q)
      );
    }

    // STATUS FILTER (⚽ FIX IMPORTANT)
    if (this.activeStatusFilter !== 'tous') {
      result = result.filter(j =>
        (j.statutSportif || 'disponible') === this.activeStatusFilter
      );
    }

    this.filteredJoueurs = result;
  }

  getActivePlayersCount(): number {
    return this.joueurs.filter(j =>
      (j.statutSportif || 'disponible') === 'disponible'
    ).length;
  }

  getInjuredPlayersCount(): number {
    return this.joueurs.filter(j =>
      j.statutSportif === 'blessé'
    ).length;
  }

  togglePlayerMenu(id: string): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  onCreateMatch(): void {}
  onSendConvocation(): void {}
  onViewPlayer(j: Joueur): void {}
  onEditPlayer(j: Joueur): void {}
  onConvocatePlayer(j: Joueur): void {}
  onChangeStatus(j: Joueur): void {}
  onViewStats(j: Joueur): void {}
  onMessagePlayer(j: Joueur): void {}

  getStatusLabel(status?: string): string {
    switch (status) {
      case 'blessé': return 'Blessé';
      case 'suspendu': return 'Suspendu';
      default: return 'Disponible';
    }
  }

  getStatusColor(status?: string): string {
    if (status === 'blessé') return '#ef4444';
    if (status === 'suspendu') return '#f59e0b';
    return '#22c55e';
  }

  getStatusBgColor(status?: string): string {
    if (status === 'blessé') return 'rgba(239,68,68,0.15)';
    if (status === 'suspendu') return 'rgba(245,158,11,0.15)';
    return 'rgba(34,197,94,0.15)';
  }

  getStatusTextColor(status?: string): string {
    if (status === 'blessé') return '#ef4444';
    if (status === 'suspendu') return '#f59e0b';
    return '#22c55e';
  }

 
  getInitiales(joueur: any): string {
    if (!joueur) return '';
  
    const prenom = joueur.prenom?.charAt(0) || '';
    const nom = joueur.nom?.charAt(0) || '';
  
    return (prenom + nom).toUpperCase();
  }


  getStatutColor(joueur: any): string {
    switch (joueur.statutSportif) {
  
      case 'disponible':
        return '#22c55e';
  
      case 'indisponible':
        return '#ef4444';
  
      case 'blessé':
        return '#f59e0b';
  
      case 'suspendu':
        return '#8b5cf6';
  
      default:
        return this.themeService.isDarkMode
          ? this.themeService.Bordernormal
          : 'rgba(255,255,255,0.6)';
    }
  }
  
  getCardShadow(joueur: any): string {
    const color = this.getStatutColor(joueur);
  
    const isDefault =
      ['disponible', 'indisponible', 'blessé', 'suspendu']
        .includes(joueur.statutSportif);
  
    if (!isDefault) {
      return this.themeService.isDarkMode
        ? '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset'
        : '0 25px 50px -12px rgba(15,23,42,0.1), 0 0 0 1px rgba(255,255,255,0.8) inset, inset 0 1px 0 rgba(255,255,255,1)';
    }
  
    return `0 0 0 2px ${color}40, 0 25px 50px -12px rgba(0,0,0,0.5)`;
  }


  voirProfil(joueur: any) {
    console.log('Profil joueur :', joueur);
  
    if (!joueur) return;
  
    const id = joueur._id || joueur.id;
  
    this.router.navigate(['/joueur', id]);
  }
  
}