import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import {
  MatchService,
  Match2
} from '../../../../Backend/Services/match.service';

import { Icon } from '../../../Composant/Share/icon/icon';

@Component({
  selector: 'app-modifier-match',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './modifier-match.html',
  styleUrl: './modifier-match.css',
})
export class ModifierMatch implements OnInit {

  // ======================================================
  // 📦 MATCH
  // ======================================================

  match: Match2 = {
    equipeDomicile: '',
    equipeExterieur: '',
    dateMatch: '',
    enCours: false
  };

  // ======================================================
  // 📦 ALL MATCHS
  // ======================================================

  allMatches: Match2[] = [];

  // ======================================================
  // ⚡ STATES
  // ======================================================

  loading: boolean = false;
  matchId: string = '';

  showNotification = false;
  notificationMessage = '';

  // ======================================================
  // 🚀 CONSTRUCTOR
  // ======================================================

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService,
    private matchService: MatchService
  ) {}

  // ======================================================
  // 🔥 INIT
  // ======================================================

  ngOnInit(): void {

    this.matchId = this.route.snapshot.paramMap.get('id') || '';

    console.log('🆔 MATCH ID :', this.matchId);

    if (!this.matchId) {
      this.notificationMessage = 'ID match introuvable';
      this.showNotification = true;
      return;
    }

    this.getAllMatches();
  }

  // ======================================================
  // 📥 GET ALL MATCHS + FIND ONE
  // ======================================================

  getAllMatches(): void {

    this.loading = true;

    this.matchService.getMatches().subscribe({

      next: (matches: Match2[]) => {

        this.allMatches = matches;

        const foundMatch = this.allMatches.find(
          (m) => m._id === this.matchId
        );

        if (!foundMatch) {
          this.notificationMessage = 'Match introuvable';
          this.showNotification = true;
          this.loading = false;
          return;
        }

        // mapping propre + sécurité
        this.match = {
          ...foundMatch,
          equipeDomicile: foundMatch.equipeDomicile || '',
          equipeExterieur: foundMatch.equipeExterieur || '',
          dateMatch: foundMatch.dateMatch || '',
          enCours: foundMatch.enCours ?? false
        };

        this.loading = false;
      },

      error: (err) => {

        console.error('❌ Erreur chargement matchs', err);

        this.notificationMessage =
          'Erreur lors du chargement des matchs';

        this.showNotification = true;
        this.loading = false;
      }
    });
  }

  // ======================================================
  // 🔥 UPDATE MATCH
  // ======================================================

  updateMatch(): void {

    if (!this.matchId) {
      this.notificationMessage = 'ID match introuvable';
      this.showNotification = true;
      return;
    }

    if (
      !this.match.equipeDomicile ||
      !this.match.equipeExterieur ||
      !this.match.dateMatch
    ) {
      this.notificationMessage = 'Veuillez remplir tous les champs obligatoires';
      this.showNotification = true;

      setTimeout(() => this.showNotification = false, 3000);
      return;
    }

    this.loading = true;

    this.matchService.updateMatch(this.matchId, this.match).subscribe({

      next: () => {

        this.notificationMessage = 'Match modifié avec succès';
        this.showNotification = true;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/match2']);
        }, 1500);
      },

      error: (err) => {

        console.error('❌ Erreur update match', err);

        this.notificationMessage = 'Erreur lors de la modification';
        this.showNotification = true;
        this.loading = false;
      }
    });
  }

  // ======================================================
  // 🔙 BACK
  // ======================================================

  goBack(): void {
    this.router.navigate(['/match2']);
  }

  // ======================================================
  // ❌ CLOSE NOTIFICATION
  // ======================================================

  closeNotification(): void {
    this.showNotification = false;
  }
}