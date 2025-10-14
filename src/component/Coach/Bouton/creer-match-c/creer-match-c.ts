// src/app/components/match/creer-match-c/creer-match-c.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match, MatchService } from '../../../../../services/match.service';
import { interval, Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

type TypeMatch = 'Championnat' | 'Tournoi' | 'Amical' | 'Coup';

@Component({
  selector: 'app-creer-match-c',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-match-c.html',
  styleUrls: ['./creer-match-c.css']
})
export class CreerMatchC implements OnInit, OnDestroy {

  user: any = null;

  match: Match & {
    categorie: string;
    logoA?: string;
    logoB?: string;
    duree?: number;
    typeMatch: TypeMatch;
  } = this.initMatch();

  categories: string[] = [
    'U6','U7','U8','U9','U10','U11','U12','U13',
    'U14','U15','U16','U17','U18','U23','Senior'
  ];

  typesMatch: TypeMatch[] = ['Championnat', 'Tournoi', 'Amical', 'Coup'];

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
    'SELONCOURT': '',
    'PORTUGAIS AUDINCOURT': '',
  };

  equipesAdverses: string[] = Object.keys(this.logos).filter(club => club !== 'ASDAM');

  loading = false;
  successMsg = '';
  errorMsg = '';
  showModal = false;

  matchTime = 0;
  private timerSub?: Subscription;

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.loadUser();
    this.updateLogos();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  // ----------------- UTILISATEUR -----------------
  private loadUser(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
        console.log('Utilisateur connecté :', this.user);
      } catch (e) {
        console.error('Erreur parsing user localStorage', e);
        this.user = null;
      }
    }
  }

  // ----------------- MODAL -----------------
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetTimer();
  }

  // ----------------- CREATION -----------------
  creerMatch(): void {
    if (!this.user) {
      this.errorMsg = 'Utilisateur non connecté';
      return;
    }

    if (!this.match.equipeA || !this.match.equipeB || !this.match.date || !this.match.lieu || !this.match.categorie) {
      this.errorMsg = 'Tous les champs sont obligatoires';
      return;
    }

    const dateISO = new Date(this.match.date).toISOString();
    if (isNaN(Date.parse(dateISO))) {
      this.errorMsg = 'La date est invalide';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.updateLogos();

    const matchToSend = { ...this.match, date: dateISO };
    console.log('Match à envoyer au backend :', matchToSend);

    // ✅ Correction TS2345 : utiliser HttpHeaders
    const headers = new HttpHeaders().set('x-user', JSON.stringify(this.user));

    this.matchService.creerMatch(matchToSend, headers).subscribe({
      next: (res) => {
        console.log('Réponse backend création match :', res);
        this.successMsg = 'Match créé avec succès !';
        this.loading = false;
        this.resetForm();
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur création match:', err);
        this.errorMsg = err?.error?.message || 'Erreur lors de la création du match';
        this.loading = false;
      }
    });
  }

  // ----------------- LOGOS -----------------
  updateLogos(): void {
    this.match.logoA = this.logos[this.match.equipeA] || 'assets/ASDAM.png';
    this.match.logoB = this.match.equipeB ? this.logos[this.match.equipeB] || '' : '';
  }

  // ----------------- TIMER -----------------
  startTimer(): void {
    this.timerSub = interval(60000).subscribe(() => {
      if (this.matchTime < (this.match.duree || 90)) this.matchTime++;
    });
  }

  resetTimer(): void {
    this.timerSub?.unsubscribe();
    this.matchTime = 0;
  }

  addGoal(team: 'A' | 'B'): void {
    if (team === 'A') this.match.scoreA!++;
    else this.match.scoreB!++;
  }

  // ----------------- RESET FORM -----------------
  private resetForm(): void {
    this.match = this.initMatch();
    this.resetTimer();
  }

  private initMatch(): Match & { categorie: string; logoA?: string; logoB?: string; duree?: number; typeMatch: TypeMatch } {
    return {
      equipeA: 'ASDAM',
      equipeB: '',
      date: '',
      lieu: '',
      categorie: '',
      typeMatch: 'Championnat',
      logoA: 'assets/ASDAM.png',
      logoB: '',
      duree: 90,
      scoreA: 0,
      scoreB: 0
    };
  }
}
