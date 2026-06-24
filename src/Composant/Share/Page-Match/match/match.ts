import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatchService,
  Match2
} from '../../../../../Backend/Services/match.service';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule,Icon],
  templateUrl: './match.html',
  styleUrl: './match.css',
})
export class Match implements OnInit {

  // =========================
  // DATA
  // =========================

  matchs: Match2[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private matchService: MatchService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.getAllMatchs();
  }

  // =========================
  // GET ALL MATCHS
  // =========================

  getAllMatchs(): void {

    this.loading = true;
    this.errorMessage = '';

    this.matchService.getMatches().subscribe({

      next: (response: Match2[]) => {

        console.log('✅ Matchs récupérés :', response);

        this.matchs = response;
        this.loading = false;

      },

      error: (error) => {

        console.error('❌ Erreur récupération matchs :', error);

        this.errorMessage = 'Impossible de récupérer les matchs';
        this.loading = false;

      }

    });

  }

    // ======================================================
  // 🗑️ DELETE EVENT
  // ======================================================
  supprimerMatch(event: any): void {

    console.log('🗑️ Supprimer événement :', event);

    const eventId = event?._id || event?.id;

    if (!eventId) {

      console.error('❌ ID événement introuvable', event);
      return;
    }

    this.goToDeleteMatch(eventId);
  }

  // ======================================================
  // 🚀 GO TO DELETE EVENT
  // ======================================================
  goToDeleteMatch(eventId: string): void {
    this.router.navigate(['/delete-match', eventId]);
  }

  // ======================================================
// ✏️ MODIFY EVENT
// ======================================================
modifierMatch(event: any): void {

  console.log('✏️ Modifier événement :', event);

  const eventId = event?._id || event?.id;

  if (!eventId) {

    console.error('❌ ID événement introuvable', event);
    return;
  }

  this.goToModifyMatch(eventId);
}

// ======================================================
// 🚀 GO TO MODIFY EVENT
// ======================================================
goToModifyMatch(eventId: string): void {
  this.router.navigate(['/modify-match', eventId]);
}

}