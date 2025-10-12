import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  selectedFilter: 'scheduled' | 'live' | 'finished' = 'scheduled';
  refreshSubscription?: Subscription;
  userConnecte?: { nom: string; role: string; categorie: string; equipe: string };
  showModal = false;
  selectedMatch: Match | null = null;

  logos: Record<string, string> = {
    ASDAM: 'assets/ASDAM.png',
    FCSM: 'assets/FCSM.png',
  };

  constructor(private matchService: MatchService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) this.userConnecte = JSON.parse(storedUser);

    this.getMatches();
    this.refreshSubscription = interval(3000).subscribe(() => this.getMatches());
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  getMatches() {
    this.matchService.getAllMatches().subscribe({
      next: (data: Match[]) => {
        this.matches = data.map(match => ({
          ...match,
          logoA: this.logos[match.equipeA] || 'assets/default.png',
          logoB: this.logos[match.equipeB] || 'assets/default.png',
          status: match.status || this.getStatus(match.date),
          scoreA: match.scoreA ?? 0,
          scoreB: match.scoreB ?? 0,
          duree: match.duree || 90
        }));
  
        // Afficher uniquement les matchs à venir ou en direct
        this.filteredMatches = this.matches.filter(m => m.status === 'live' || m.status === 'scheduled');
      },
      error: err => console.error(err)
    });
  }
  

  setFilter(status: 'live' | 'scheduled' | 'finished') {
    this.selectedFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredMatches = this.matches.filter(m => m.status === this.selectedFilter);
  }

  getStatus(date: string): 'scheduled' | 'live' | 'finished' {
    const now = new Date();
    const matchDate = new Date(date);
    const end = new Date(matchDate.getTime() + 90 * 60000);
    if (now < matchDate) return 'scheduled';
    if (now >= matchDate && now <= end) return 'live';
    return 'finished';
  }

  scoreColor(a: number = 0, b: number = 0, side: 'A' | 'B'): string {
    if (a === b) return 'text-[var(--Black)]';
    return side === 'A' ? (a > b ? 'text-[var(--Vert)]' : 'text-[var(--Rouge-Clair)]') 
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

  updateScore(match: Match, side: 'A' | 'B', delta: number) {
    if (!match || !this.userConnecte || this.userConnecte.role !== 'coach') return;

    if (side === 'A') match.scoreA = Math.max(0, (match.scoreA || 0) + delta);
    else match.scoreB = Math.max(0, (match.scoreB || 0) + delta);

    this.matchService.updateScore(match._id!, match.scoreA!, match.scoreB!).subscribe({
      next: () => this.getMatches(),
      error: err => console.error('Erreur mise à jour score :', err)
    });
  }

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
