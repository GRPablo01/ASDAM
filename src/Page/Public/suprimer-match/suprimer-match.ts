import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon } from '../../../Composant/Share/icon/icon';
import { MatchService } from '../../../../Backend/Services/match.service';

@Component({
  selector: 'app-suprimer-match',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './suprimer-match.html',
  styleUrl: './suprimer-match.css',
})
export class SuprimerMatch implements OnInit {

  // Tous les matchs
  matches: any[] = [];

  // Match sélectionné
  match: any = null;

  loading: boolean = false;
  matchId: string = '';

  // ======================================================
  // 🔔 NOTIFICATION
  // ======================================================
  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService,
    private matchService: MatchService
  ) {}

  ngOnInit(): void {
    this.matchId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.matchId) return;

    this.loadMatches();
  }

  // ======================================================
  // 📥 LOAD ALL MATCHES + FILTER
  // ======================================================
  loadMatches(): void {
    this.loading = true;

    this.matchService.getMatches().subscribe({
      next: (res: any) => {

        // gestion API flexible
        this.matches = res?.matches || res || [];

        // 👉 on récupère uniquement le match correspondant à l'ID
        this.match = this.matches.find(
          (m: any) => (m._id || m.id) === this.matchId
        ) || null;

        this.loading = false;
      },

      error: (err: any) => {
        console.error('Erreur chargement matchs:', err);
        this.loading = false;
      }
    });
  }

  // ======================================================
  // 🔔 OPEN NOTIFICATION
  // ======================================================
  openDeleteNotification(): void {
    this.showNotification = true;
    this.notificationMessage =
      `Suppression en cours pour le match ${this.match?.titre || ''}`;
  }

  closeNotification(): void {
    this.showNotification = false;
  }

  // ======================================================
  // 🗑️ DELETE MATCH
  // ======================================================
  deleteMatch(): void {

    if (!this.matchId) {
      this.notificationMessage = 'ID du match introuvable';
      this.showNotification = true;
      return;
    }

    this.matchService.deleteMatch(this.matchId).subscribe({
      next: () => {

        this.notificationMessage = 'Match supprimé avec succès';
        this.showNotification = true;

        setTimeout(() => {
          this.router.navigate(['/match2']);
        }, 1200);
      },

      error: (err: any) => {
        console.error('Erreur suppression match:', err);

        this.notificationMessage = 'Erreur lors de la suppression';
        this.showNotification = true;
      }
    });
  }

  // ======================================================
  // 🔙 BACK
  // ======================================================
  goBack(): void {
    this.router.navigate(['/match2']);
  }
}