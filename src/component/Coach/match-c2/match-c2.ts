import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

interface Match {
  _id?: string;
  equipeA: string;
  equipeB: string;
  date: string;
  lieu: string;
  categorie: string;
  typeMatch: string;
  scoreA?: number;
  scoreB?: number;
  logoA?: string;
  logoB?: string;
  arbitre?: string;
  stade?: string;
  duree?: number;
  status?: 'scheduled' | 'live' | 'finished';
  minute?: number;
}

@Component({
  selector: 'app-match-c2',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './match-c2.html',
  styleUrls: ['./match-c2.css'],
})
export class MatchC2 implements OnInit, OnDestroy {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  selectedFilter: 'scheduled' | 'live' | 'finished' = 'scheduled';
  refreshSubscription?: Subscription;

  logos: Record<string, string> = {
    'ASDAM': 'assets/logo-equipe-U23/ASDAM.png',
    'GIROLEPUIX': 'assets/logo-equipe-U23/GIROLEPUIX.png',
    'MONBELIARDASC': 'assets/logo-equipe-U23/MONBELIARDASC.png',
    'DAMPIERRE': 'assets/logo-equipe-U23/DAMPIERRE.png',
    'BEAUCOURT': 'assets/logo-equipe-U23/BEAUCOURT.png',
    'MHSC': 'assets/logo-equipe-U23/MONTREUX.png',
    'NOMMAY': 'assets/logo-equipe-U23/NOMMAY.png',
    'ARCEY': 'assets/logo-equipe-U23/ARCEY.png',
    'ESSERT': 'assets/logo-equipe-U23/ESSERT.png',
    
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getMatches();
    this.refreshSubscription = interval(3000).subscribe(() => this.getMatches());
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  getMatches() {
    this.http.get<Match[]>('http://localhost:3000/api/matches').subscribe({
      next: (data) => {
        const now = new Date();
        this.matches = data.map((match) => {
          const matchDate = new Date(match.date);
          const end = new Date(matchDate.getTime() + (match.duree || 90) * 60000);
          const status: 'scheduled' | 'live' | 'finished' =
            now < matchDate ? 'scheduled' :
            now >= matchDate && now <= end ? 'live' :
            'finished';
  
          return {
            ...match,
            logoA: this.logos[match.equipeA] || 'assets/default.png',
            logoB: this.logos[match.equipeB] || 'assets/default.png',
            duree: match.duree || 90,
            status
          };
        });
  
        this.applyFilter();
      },
      error: (err) => console.error('Erreur récupération matchs:', err),
    });
  }
  

  /** --- FILTRAGE --- **/
  setFilter(status: 'scheduled' | 'live' | 'finished') {
    this.selectedFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredMatches = this.matches.filter(m => m.status === this.selectedFilter);
  }

  /** --- STYLES --- **/
  getButtonClass(type: 'scheduled' | 'live' | 'finished'): string {
    const base = 'px-4 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm';
    const colors = {
      scheduled: 'bg-gradient-to-br from-[var(--Rouge)] to-[var(--Rouge-Foncé)] hover:from-[var(--Bleu)] hover:to-[var(--Bleu-Foncé)] text-white',
      live: 'bg-gradient-to-br from-[var(--Rouge)] to-[var(--Rouge-Foncé)] hover:from-[var(--Bleu)] hover:to-[var(--Bleu-Foncé)] text-white',
      finished: 'bg-gradient-to-br from-[var(--Rouge)] to-[var(--Rouge-Foncé)] hover:from-[var(--Bleu)] hover:to-[var(--Bleu-Foncé)] text-white',
    };
    
    const active = this.selectedFilter === type ? 'ring-4 ring-indigo-300 scale-105' : 'opacity-80';
    return `${base} ${colors[type]} ${active}`;
  }

  /** --- LOGIQUE MATCH --- **/
  getStatus(date: string): 'scheduled' | 'live' | 'finished' {
    const now = new Date();
    const matchDate = new Date(date);
    const end = new Date(matchDate.getTime() + 90 * 60000);
    if (now < matchDate) return 'scheduled';
    if (now >= matchDate && now <= end) return 'live';
    return 'finished';
  }

  getTimeLeft(match: Match): string {
    if (match.status === 'live') {
      const now = new Date();
      const start = new Date(match.date).getTime();
      const diff = now.getTime() - start;
      const minute = Math.min(Math.floor(diff / 60000), match.duree || 90);
      return `${minute}'`;
    }
    return '';
  }

  scoreColor(a: number, b: number, side: 'A' | 'B'): string {
    if (a === b) return 'text-[var(--Black)]';
    return side === 'A'
      ? a > b ? 'text-[var(--Vert)]' : 'text-[var(--Rouge-Clair)]'
      : b > a ? 'text-[var(--Vert)]' : 'text-[var(--Rouge-Clair)]';
  }
}
