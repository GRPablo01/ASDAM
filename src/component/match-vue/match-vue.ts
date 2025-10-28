// src/app/components/match-vue/match-vue.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Match, MatchService } from '../../../services/match.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrainSubway } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-match-vue',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './match-vue.html',
  styleUrls: ['./match-vue.css'],
})
export class MatchVue implements OnInit, OnDestroy {
  matchs: Match[] = [];
  loading = false;
  error: string | null = null;

  faTrainSubway = faTrainSubway;
  userTeam: string | null = null;
  selectedMatch: Match | null = null;
  userHeader: HttpHeaders | null = null;

  private refreshInterval: any;

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    // Récupération de l'équipe de l'utilisateur depuis le localStorage
    const userData = localStorage.getItem('utilisateur');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userTeam = user.equipe;

        // Préparer le header x-user pour les requêtes PATCH
        this.userHeader = new HttpHeaders().set('x-user', JSON.stringify(user));
        console.log('Header x-user:', this.userHeader.get('x-user'));
      } catch (err) {
        console.error('Erreur localStorage:', err);
      }
    }

    // Récupération initiale des matchs
    this.getAllMatches();

    // Rafraîchir tous les 10 secondes
    this.refreshInterval = setInterval(() => {
      console.log('Rafraîchissement automatique des matchs...');
      this.getAllMatches();
    }, 10000);
  }

  ngOnDestroy(): void {
    // Nettoyer l'intervalle pour éviter les fuites mémoire
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  /** --- Récupération des matchs et calcul du statut dynamique --- **/
  getAllMatches(): void {
    this.loading = true;
    this.matchService.getAllMatches().subscribe({
      next: (data) => {
        const now = new Date();
        this.matchs = data
          .filter((m) => (this.userTeam ? m.categorie === this.userTeam : true))
          .map((match) => {
            const dateMatch = new Date(match.date);
            const [hDebut, mDebut] = (match.heureDebut || '00:00').split(':').map(Number);
            const [hFin, mFin] = (match.heureFin || '00:00').split(':').map(Number);

            const start = new Date(dateMatch);
            start.setHours(hDebut, mDebut, 0, 0);

            const end = new Date(dateMatch);
            end.setHours(hFin, mFin, 0, 0);

            let status: 'A venir' | 'En directe' | 'Terminer' = 'A venir';
            if (now < start) status = 'A venir';
            else if (now >= start && now <= end) status = 'En directe';
            else status = 'Terminer';

            let minute = 0;
            if (status === 'En directe') {
              const diff = Math.floor((now.getTime() - start.getTime()) / 60000);
              minute = Math.min(diff, match.duree || 90);
            }

            return { ...match, status, minute };
          });

        console.log('Matchs récupérés:', this.matchs);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération matchs:', err);
        this.error = 'Impossible de récupérer les matchs.';
        this.loading = false;
      },
    });
  }

  /** --- Traduction du statut pour affichage --- **/
  translateStatus(status: string | undefined): string {
    switch (status) {
      case 'A venir': return 'A venir';
      case 'En directe': return 'En directe';
      case 'Terminer': return 'Terminé';
      default: return status || '';
    }
  }

  /** --- Calcul du temps restant / minute --- **/
  getTimeLeft(match: Match): string {
    if (!match.date) return '';
    if (match.status === 'En directe') return `${match.minute}'`;

    const now = new Date();
    const dateMatch = new Date(match.date);
    const [hDebut, mDebut] = (match.heureDebut || '00:00').split(':').map(Number);
    const start = new Date(dateMatch);
    start.setHours(hDebut, mDebut, 0, 0);

    const diffMinutes = Math.floor((start.getTime() - now.getTime()) / 60000);
    if (diffMinutes > 0) return `Début dans ${diffMinutes} min`;
    return '';
  }

  /** --- Couleur du score pour affichage --- **/
  scoreColor(scoreA: number | undefined, scoreB: number | undefined, team: 'A' | 'B'): string {
    if (scoreA === undefined || scoreB === undefined) return 'text-gray-400';
    if (scoreA === scoreB) return 'text-gray-600';
    if (team === 'A') return scoreA > scoreB ? 'text-green-600' : 'text-red-600';
    return scoreB > scoreA ? 'text-green-600' : 'text-red-600';
  }

  /** --- Pop-up édition du match --- **/
  openMatch(match: Match) {
    this.selectedMatch = { ...match };
    console.log('Match sélectionné:', this.selectedMatch);
  }

  closeMatch() {
    this.selectedMatch = null;
    console.log('Fermeture pop-up match');
  }

  /** --- Sauvegarde du score / modifications --- **/
  saveScore() {
    if (!this.selectedMatch || !this.selectedMatch._id) return;

    const id = this.selectedMatch._id;
    const payload: Partial<Match> = {
      scoreA: this.selectedMatch.scoreA ?? 0,
      scoreB: this.selectedMatch.scoreB ?? 0,
      status: this.selectedMatch.status,
      minute: this.selectedMatch.minute ?? 0,
      heureDebut: this.selectedMatch.heureDebut,
      heureFin: this.selectedMatch.heureFin
    };

    console.log('PATCH payload envoyé:', payload, 'ID:', id);

    this.matchService.updateMatch(id, payload, this.userHeader || undefined).subscribe({
      next: (updatedMatch) => {
        console.log('Match mis à jour avec succès:', updatedMatch);
        const index = this.matchs.findIndex((m) => m._id === id);
        if (index !== -1) this.matchs[index] = updatedMatch;
        this.closeMatch();
      },
      error: (err) => {
        console.error('Erreur mise à jour du match:', err);
        alert('Erreur lors de la mise à jour du match.');
      },
    });
  }

  get activeMatches(): Match[] {
    return this.matchs ? this.matchs.filter(m => m.status !== 'Terminer') : [];
  }
  
}
