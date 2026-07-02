import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Joueur, JoueurService } from '../../../../../Backend/Services/joueur.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

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
    public themeService: ThemeService
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

  getInitiales(nom: string, prenom: string): string {
    if (!nom && !prenom) return '?';
    return (prenom?.charAt(0) + nom?.charAt(0)).toUpperCase();
  }
}