//==============// IMPORTS //==============//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match, MatchService } from '../../../../services/match.service';
import { Subscription, interval } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

//==============// TYPES //==============//
type TypeMatch = 'Championnat' | 'Tournoi' | 'Amical' | 'Coup';

//==============// DÉCORATEUR COMPONENT //==============//
@Component({
  selector: 'app-creer-match',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creer-match.html',
  styleUrls: ['./creer-match.css']
})

//==============// CLASSE CREERMATCH //==============//
export class CreerMatch implements OnInit, OnDestroy {

  user: any = null;

  match: Match & {
    categorie: string;
    logoA?: string;
    logoB?: string;
    duree?: number;
    typeMatch: TypeMatch;
    hourStart?: string;
    hourEnd?: string;
    domicile?: boolean;
  } = this.initMatch();

  existingMatches: Match[] = [];

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

  stades: string[] = [
    'Stade de Danjoutin',
    "Stade d'Andelnans",
  ];

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
    this.loadExistingMatches();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  private loadUser(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      try { this.user = JSON.parse(userStr); } 
      catch { this.user = null; }
    }
  }

  private loadExistingMatches(): void {
    this.matchService.getAllMatches().subscribe(matches => {
      this.existingMatches = matches;
    });
  }

  private checkConflit(): boolean {
    if (!this.match.date || !this.match.hourStart || !this.match.hourEnd || !this.match.lieu) return false;

    const start = new Date(`${this.match.date}T${this.match.hourStart}`);
    const end = new Date(`${this.match.date}T${this.match.hourEnd}`);

    for (let m of this.existingMatches) {
      const mStart = new Date(`${m.date}T${m.heureDebut}`);
      const mEnd = new Date(`${m.date}T${m.heureFin}`);

      if ((start < mEnd && end > mStart) && m.lieu === this.match.lieu) {
        this.errorMsg = '⚠ Un match existe déjà à ce créneau horaire et lieu.';
        return true;
      }
    }
    return false;
  }

  openModal(): void { this.showModal = true; }
  closeModal(): void { this.showModal = false; this.resetTimer(); }

  private initMatch(): Match & {
    categorie: string;
    logoA?: string;
    logoB?: string;
    duree?: number;
    typeMatch: TypeMatch;
    hourStart?: string;
    hourEnd?: string;
    domicile?: boolean;
  } {
    return {
      equipeA: 'ASDAM',
      equipeB: '',
      opponent: '',
      date: '',
      hourStart: '',
      hourEnd: '',
      lieu: '',
      scoreA: 0,
      scoreB: 0,
      categorie: '',
      typeMatch: 'Championnat',
      logoA: 'assets/ASDAM.png',
      logoB: '',
      duree: 90,
      domicile: true
    };
  }

  creerMatch(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.user) { this.errorMsg = 'Utilisateur non connecté'; return; }

    // Validation stricte des champs
    if (!this.match.equipeA || !this.match.equipeB || !this.match.date || !this.match.lieu || !this.match.categorie || !this.match.hourStart || !this.match.hourEnd) {
      this.errorMsg = 'Tous les champs sont obligatoires';
      return;
    }

    // Formatage correct des heures et date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const hourRegex = /^\d{2}:\d{2}$/;

    if (!dateRegex.test(this.match.date)) { this.errorMsg = 'Date invalide (YYYY-MM-DD requis)'; return; }
    if (!hourRegex.test(this.match.hourStart) || !hourRegex.test(this.match.hourEnd)) { this.errorMsg = 'Heures invalides (HH:mm requis)'; return; }

    const start = new Date(`${this.match.date}T${this.match.hourStart}`);
    const end = new Date(`${this.match.date}T${this.match.hourEnd}`);

    if (start >= end) { this.errorMsg = 'L’heure de début doit être avant l’heure de fin'; return; }

    if (this.checkConflit()) return;

    this.loading = true;
    this.updateLogos();

    // Préparer l'objet à envoyer au backend
    const matchToSend: Match = { 
      equipeA: this.match.equipeA,
      equipeB: this.match.equipeB,
      opponent: this.match.opponent || '', // <-- Obligatoire
      date: this.match.date,
      lieu: this.match.lieu,
      categorie: this.match.categorie,
      typeMatch: this.match.typeMatch,
      logoA: this.match.logoA || '',
      logoB: this.match.logoB || '',
      arbitre: this.match.arbitre || '',
      stade: this.match.lieu,
      heureDebut: this.match.hourStart!,
      heureFin: this.match.hourEnd!,
      scoreA: this.match.scoreA ?? 0,
      scoreB: this.match.scoreB ?? 0,
      status: 'A venir',
      duree: this.match.duree ?? 90
    };
    

    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'x-user': JSON.stringify(this.user) });

    console.log('matchToSend', matchToSend);

    this.matchService.creerMatch(matchToSend, headers).subscribe({
      next: (res) => { 
        this.successMsg = 'Match créé avec succès !'; 
        this.loading = false; 
        this.resetForm(); 
        this.closeModal(); 
        this.loadExistingMatches();
      },
      error: (err) => { 
        this.errorMsg = err?.error?.message || 'Erreur lors de la création du match'; 
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
    this.match = this.initMatch(); 
    this.resetTimer(); 
  }

  setDomicile(isDomicile: boolean) {
    this.match.domicile = isDomicile;
    this.match.lieu = isDomicile ? this.stades[0] : '';
  }

}
