import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match, MatchService } from '../../../../../services/match.service';
import { interval, Subscription } from 'rxjs';

type TypeMatch = "Championnat" | "Tournoi" | "Amical" | "Coup"; // 🔹 Définition du type strict

@Component({
  selector: 'app-creer-match-c',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-match-c.html',
  styleUrls: ['./creer-match-c.css']
})
export class CreerMatchC implements OnInit, OnDestroy {

  match: Match & { 
    categorie: string; 
    logoA?: string; 
    logoB?: string; 
    duree?: number;
    typeMatch: TypeMatch; // ✅ Typage explicite
  } = {
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

  categories: string[] = [
    'U6','U7','U8','U9','U10','U11','U12','U13',
    'U14','U15','U16','U17','U18','U23','Senior'
  ];

  // ✅ Typage strict : plus de string[] ici
  typesMatch: TypeMatch[] = ['Championnat', 'Tournoi', 'Amical', 'Coup'];

  logos: Record<string, string> = {
    'ASDAM': 'assets/ASDAM.png',
    'FCSM': 'assets/FCSM.png',
    'OM': 'assets/OM.png',
    'PSG': 'assets/PSG.png',
    'OL': 'assets/OL.png',
    'MHSC': 'assets/MHSC.png'
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
    this.updateLogos();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetTimer();
  }

  creerMatch(): void {
    if (!this.match.equipeA || !this.match.equipeB || !this.match.date || !this.match.lieu || !this.match.categorie) {
      this.errorMsg = 'Tous les champs sont obligatoires';
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.updateLogos();

    const matchToSend = { ...this.match, date: new Date(this.match.date).toISOString() };

    this.matchService.creerMatch(matchToSend).subscribe({
      next: () => {
        this.successMsg = 'Match créé avec succès !';
        this.loading = false;
        this.resetForm();
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erreur lors de la création du match';
        this.loading = false;
      }
    });
  }

  updateLogos(): void {
    this.match.logoA = this.logos[this.match.equipeA] || 'assets/ASDAM.png';
    this.match.logoB = this.match.equipeB ? this.logos[this.match.equipeB] || '' : '';
  }

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

  private resetForm(): void {
    this.match = {
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
    this.resetTimer();
  }
}
