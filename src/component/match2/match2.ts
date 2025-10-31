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
  status?: 'A venir' | 'En directe' | 'Terminé';
  minute?: number;
  heureDebut?: string;
  heureFin?: string;
}

@Component({
  selector: 'app-match2',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './match2.html',
  styleUrls: ['./match2.css'],
})
export class Match2 implements OnInit, OnDestroy {
  matches: Match[] = [];
  filteredMatches: Match[] = [];
  selectedFilter: 'A venir' | 'En directe' | 'Terminé' = 'A venir';
  refreshSubscription?: Subscription;

  logos: Record<string, string> = {
    ASDAM: 'assets/logo-equipe-U23/ASDAM.png',
    GIROLEPUIX: 'assets/logo-equipe-U23/GIROLEPUIX.png',
    MONBELIARDASC: 'assets/logo-equipe-U23/MONBELIARDASC.png',
    DAMPIERRE: 'assets/logo-equipe-U23/DAMPIERRE.png',
    BEAUCOURT: 'assets/logo-equipe-U23/BEAUCOURT.png',
    MHSC: 'assets/logo-equipe-U23/MONTREUX.png',
    NOMMAY: 'assets/logo-equipe-U23/NOMMAY.png',
    ARCEY: 'assets/logo-equipe-U23/ARCEY.png',
    ESSERT: 'assets/logo-equipe-U23/ESSERT.png',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // 🔹 Charger le dernier filtre choisi (s'il existe)
    const savedFilter = localStorage.getItem('lastFilter');
    if (savedFilter === 'A venir' || savedFilter === 'En directe' || savedFilter === 'Terminé') {
      this.selectedFilter = savedFilter;
    }

    this.getMatches();
    this.refreshSubscription = interval(10000).subscribe(() => this.getMatches());
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  /** --- RÉCUPÉRATION DES MATCHS --- **/
  getMatches() {
    this.http.get<Match[]>('http://localhost:3000/api/matches').subscribe({
      next: (data) => {
        const now = new Date();

        this.matches = data.map((match) => {
          const dateMatch = new Date(match.date);

          const [hDebut, mDebut] = (match.heureDebut || '00:00').split(':').map(Number);
          const [hFin, mFin] = (match.heureFin || '00:00').split(':').map(Number);

          const start = new Date(dateMatch);
          start.setHours(hDebut, mDebut, 0, 0);

          const end = new Date(dateMatch);
          end.setHours(hFin, mFin, 0, 0);

          let status: 'A venir' | 'En directe' | 'Terminé' = 'A venir';
          if (now < start) status = 'A venir';
          else if (now >= start && now <= end) status = 'En directe';
          else status = 'Terminé';

          let minute = 0;
          if (status === 'En directe') {
            const diff = Math.floor((now.getTime() - start.getTime()) / 60000);
            minute = Math.min(diff, match.duree || 90);
          }

          return {
            ...match,
            logoA: this.logos[match.equipeA] || 'assets/default.png',
            logoB: this.logos[match.equipeB] || 'assets/default.png',
            status,
            minute,
          };
        });

        this.applyFilter();
      },
      error: (err) => console.error('Erreur récupération matchs:', err),
    });
  }

  /** --- FILTRAGE --- **/
  setFilter(status: 'A venir' | 'En directe' | 'Terminé') {
    this.selectedFilter = status;
    localStorage.setItem('lastFilter', status); // 🔹 Sauvegarde du filtre cliqué
    this.applyFilter();
  }

  applyFilter() {
    this.filteredMatches = this.matches.filter((m) => m.status === this.selectedFilter);
  }

  /** --- STYLES DES BOUTONS --- **/
  getButtonClass(type: 'A venir' | 'En directe' | 'Terminé'): string {
    const base = 'px-4 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm';
    const colors = {
      'A venir': 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white',
      'En directe': 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white',
      'Terminé': 'bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white'
    };
    const active = this.selectedFilter === type ? ' scale-105' : 'opacity-40';
    return `${base} ${colors[type]} ${active}`;
  }

  /** --- TEMPS RESTANT --- **/
  getTimeLeft(match: Match): string {
    if (match.status === 'En directe') {
      return `${match.minute}'`;
    }
    return '';
  }

  /** --- COULEUR DU SCORE ET DU NOM --- **/
  scoreColor(a: number | undefined, b: number | undefined, side: 'A' | 'B'): string {
    if (a === undefined || b === undefined || a === b)
      return 'text-[var(--Black)] dark:text-[var(--Blanc)]';

    return side === 'A'
      ? a > b
        ? 'text-[var(--Vert)] font-extrabold'
        : 'text-[var(--Rouge-Clair)] opacity-80'
      : b > a
      ? 'text-[var(--Vert)] font-extrabold'
      : 'text-[var(--Rouge-Clair)] opacity-80';
  }
}
