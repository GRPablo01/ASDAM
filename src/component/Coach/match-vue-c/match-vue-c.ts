// ✅ Importations
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { MatchService, Match } from '../../../../services/match.service';

@Component({
  selector: 'app-match-vue-c',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './match-vue-c.html',
  styleUrls: ['./match-vue-c.css']
})
export class MatchVueC implements OnInit, OnDestroy {
  // ✅ Données principales
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  selectedFilter: 'scheduled' | 'live' | 'finished' = 'scheduled';
  refreshSubscription?: Subscription;
  userConnecte?: { nom: string; role: string; categorie: string; equipe: string };

  // ✅ UI
  showModal = false;
  selectedMatch: Match | null = null;

  // ✅ Logos d’équipes
  logos: Record<string, string> = {
    ASDAM: 'assets/ASDAM.png',
    FCSM: 'assets/FCSM.png',
  };

  constructor(private matchService: MatchService) {}

  // ------------------- LIFECYCLE -------------------
  ngOnInit() {
    // 🔹 Récupérer l’utilisateur connecté
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      this.userConnecte = JSON.parse(storedUser);
      console.log('👤 Utilisateur connecté :', this.userConnecte);
    }

    // 🔹 Charger les matchs
    this.getMatches();

    // 🔹 Rafraîchissement auto toutes les 3 secondes
    this.refreshSubscription = interval(3000).subscribe(() => this.getMatches());
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  // ------------------- MATCHES -------------------
  getMatches() {
    this.matchService.getAllMatches().subscribe({
      next: (data: Match[]) => {
        this.matches = data.map(match => ({
          ...match,
          logoA: this.logos[match.equipeA as string] || 'assets/default.png',
          logoB: this.logos[match.equipeB as string] || 'assets/default.png',
          status: match.status || this.getStatus(match.date),
          scoreA: match.scoreA ?? 0,
          scoreB: match.scoreB ?? 0,
          duree: match.duree || 90
        }));

        // 🔹 Appliquer le filtre actif
        this.applyFilter();
      },
      error: err => console.error('❌ Erreur getMatches:', err)
    });
  }

  // ------------------- FILTRES -------------------
  setFilter(status: 'live' | 'scheduled' | 'finished') {
    this.selectedFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredMatches = this.matches.filter(m => m.status === this.selectedFilter);
  }

  // ------------------- STATUT -------------------
  getStatus(date: string | undefined): 'scheduled' | 'live' | 'finished' {
    if (!date) return 'scheduled';
    const now = new Date();
    const matchDate = new Date(date);
    const end = new Date(matchDate.getTime() + (90 * 60000));
    if (now < matchDate) return 'live';
    if (now >= matchDate && now <= end) return 'live';
    return 'finished';
  }
  
  // ------------------- SCORE -------------------
  scoreColor(a: number = 0, b: number = 0, side: 'A' | 'B'): string {
    if (a === b) return 'text-[var(--Black)]';
    return side === 'A'
      ? (a > b ? 'text-[var(--Vert)]' : 'text-[var(--Rouge-Clair)]')
      : (b > a ? 'text-[var(--Vert)]' : 'text-[var(--Rouge-Clair)]');
  }

  openMatchModal(match: Match) {
    this.selectedMatch = match;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedMatch = null;
  }

  // ✅ MISE À JOUR DU SCORE (avec rôle coach)
  updateScore(match: Match, side: 'A' | 'B', delta: number) {
    if (!match) return;
    if (!this.userConnecte || this.userConnecte.role !== 'coach') {
      console.warn('⛔ Accès refusé : seul un coach peut modifier le score');
      return;
    }

    if (side === 'A') match.scoreA = Math.max(0, (match.scoreA || 0) + delta);
    else match.scoreB = Math.max(0, (match.scoreB || 0) + delta);

    // 🔹 Envoi au backend avec le rôle dans le header
    const headers = new HttpHeaders({
      'x-user': JSON.stringify(this.userConnecte)
    });

    this.matchService.updateScore(match._id!, match.scoreA!, match.scoreB!, headers).subscribe({
      next: () => {
        console.log('✅ Score mis à jour');
        this.getMatches();
      },
      error: err => console.error('❌ Erreur mise à jour score :', err)
    });
  }

  // ------------------- TEMPS -------------------
  getTimeLeft(match: Match): string {
    if (match.status === 'live') {
      const now = new Date().getTime();
      const start = new Date(match.date).getTime();
      const diff = now - start;
      const minute = Math.min(Math.floor(diff / 60000), match.duree || 90);
      return `${minute}'`;
    }
    return '';
  }
}
