import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { EquipeService, Equipe } from '../../../../../Backend/Services/equipe.Service';
import { MatchService, Match2 } from '../../../../../Backend/Services/match.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


export interface ClassementEntry {
  position: number;
  equipe: string;
  logo?: string;
  logoUrl?: string;
  joues: number;
  gagnes: number;
  nuls: number;
  perdus: number;
  bp: number;
  bc: number;
  diff: number;
  points: number;
  forme: ('V' | 'N' | 'D')[];
}

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './classe.html',
  styleUrl: './classe.css',
})
export class Classe implements OnInit {

  // ── Services ─────────────────────────────
  private equipeService = inject(EquipeService);
  private matchService = inject(MatchService);


  constructor(
      public themeService: ThemeService
    ) {}

  // ── Data ─────────────────────────────────
  equipes: Equipe[] = [];
  matchs: Match2[] = [];
  classement: ClassementEntry[] = [];
  selectedCategorie: string | null = null;
  isLoading = true;
  hoverRefresh = false
  hoveredRow = -1

  // ── Base URL pour les images ─────────────
  private readonly API_BASE_URL = 'http://localhost:3000';

  // ── Clé localStorage ─────────────────────
  private readonly STORAGE_KEY = 'classement_last_categorie';

  // ── Catégories affichées dans la sidebar ──
  categories = [
    'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13',
    'U13F', 'U18', 'U23', 'Senior A', 'Senior B', 'Senior D',
  ];

  // ── Lifecycle ────────────────────────────
  ngOnInit(): void {
    // Vérifier si une catégorie a déjà été sélectionnée
    const savedCategorie = localStorage.getItem(this.STORAGE_KEY);
    if (savedCategorie && this.categories.includes(savedCategorie)) {
      this.selectedCategorie = savedCategorie;
    }
    
    this.loadData();
  }

  // ── Load all data ────────────────────────
  loadData(): void {
    this.isLoading = true;

    Promise.all([
      this.loadTeamsPromise(),
      this.loadMatchesPromise()
    ]).then(() => {
      this.isLoading = false;
      // Si une catégorie était sauvegardée (ou sélectionnée), recalculer son classement
      if (this.selectedCategorie) {
        this.calculerClassement(this.selectedCategorie);
      }
    });
  }

  private loadTeamsPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.equipeService.getTeams().subscribe({
        next: (data) => {
          this.equipes = data;
          resolve();
        },
        error: (err) => {
          console.error('Erreur équipes:', err);
          resolve();
        }
      });
    });
  }

  private loadMatchesPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.matchService.getMatches().subscribe({
        next: (data) => {
          this.matchs = data;
          resolve();
        },
        error: (err) => {
          console.error('Erreur matchs:', err);
          resolve();
        }
      });
    });
  }

  // ── Construire l'URL complète du logo ────
  getLogoUrl(logoFilename: string | undefined): string {
    if (!logoFilename) {
      return '';
    }
    if (logoFilename.startsWith('http')) {
      return logoFilename;
    }
    return `${this.API_BASE_URL}/uploads/equipe/${logoFilename}`;
  }

  // ── Sélection catégorie ──────────────────
  selectCategorie(categorie: string): void {
    this.selectedCategorie = categorie;
    // Sauvegarder dans le localStorage pour mémoriser la sélection
    localStorage.setItem(this.STORAGE_KEY, categorie);
    this.calculerClassement(categorie);
  }

  // ── Récupérer les équipes d'une catégorie (INCLUANT les 'ALL') ──
  getEquipesByCategorie(categorie: string): Equipe[] {
    return this.equipes.filter(e => 
      e.categorie === categorie || e.categorie === 'ALL'
    );
  }

  // ── Calcul du classement ───────────────
  calculerClassement(categorie: string): void {
    const equipesCategorie = this.getEquipesByCategorie(categorie);
    const matchsCategorie = this.matchs.filter(m => 
      (m.categorie === categorie || m.categorie === 'ALL') &&
      !m.enCours &&
      m.scoreDomicile !== undefined &&
      m.scoreExterieur !== undefined
    );

    const statsMap = new Map<string, {
      equipe: string;
      logo?: string;
      logoUrl?: string;
      joues: number;
      gagnes: number;
      nuls: number;
      perdus: number;
      bp: number;
      bc: number;
      points: number;
      forme: ('V' | 'N' | 'D')[];
    }>();

    equipesCategorie.forEach(eq => {
      statsMap.set(eq.nom, {
        equipe: eq.nom,
        logo: eq.logo,
        logoUrl: this.getLogoUrl(eq.logo),
        joues: 0, gagnes: 0, nuls: 0, perdus: 0,
        bp: 0, bc: 0, points: 0,
        forme: []
      });
    });

    matchsCategorie.forEach(match => {
      const dom = match.equipeDomicile;
      const ext = match.equipeExterieur;
      const scoreDom = match.scoreDomicile ?? 0;
      const scoreExt = match.scoreExterieur ?? 0;

      const statsDom = statsMap.get(dom);
      if (statsDom) {
        statsDom.joues++;
        statsDom.bp += scoreDom;
        statsDom.bc += scoreExt;
        if (scoreDom > scoreExt) {
          statsDom.gagnes++;
          statsDom.points += 3;
          statsDom.forme.unshift('V');
        } else if (scoreDom === scoreExt) {
          statsDom.nuls++;
          statsDom.points += 1;
          statsDom.forme.unshift('N');
        } else {
          statsDom.perdus++;
          statsDom.forme.unshift('D');
        }
        statsDom.forme = statsDom.forme.slice(0, 5);
      }

      const statsExt = statsMap.get(ext);
      if (statsExt) {
        statsExt.joues++;
        statsExt.bp += scoreExt;
        statsExt.bc += scoreDom;
        if (scoreExt > scoreDom) {
          statsExt.gagnes++;
          statsExt.points += 3;
          statsExt.forme.unshift('V');
        } else if (scoreExt === scoreDom) {
          statsExt.nuls++;
          statsExt.points += 1;
          statsExt.forme.unshift('N');
        } else {
          statsExt.perdus++;
          statsExt.forme.unshift('D');
        }
        statsExt.forme = statsExt.forme.slice(0, 5);
      }
    });

    let entries: ClassementEntry[] = Array.from(statsMap.values()).map(s => ({
      position: 0,
      equipe: s.equipe,
      logo: s.logo,
      logoUrl: s.logoUrl,
      joues: s.joues,
      gagnes: s.gagnes,
      nuls: s.nuls,
      perdus: s.perdus,
      bp: s.bp,
      bc: s.bc,
      diff: s.bp - s.bc,
      points: s.points,
      forme: s.forme
    }));

    entries.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.diff !== a.diff) return b.diff - a.diff;
      if (b.bp !== a.bp) return b.bp - a.bp;
      return a.equipe.localeCompare(b.equipe);
    });

    entries.forEach((entry, index) => {
      entry.position = index + 1;
    });

    this.classement = entries;
  }

  // ── Helpers ─────────────────────────────
  hasEquipe(categorie: string): boolean {
    return this.getEquipesByCategorie(categorie).length > 0;
  }

  getMatchsCount(categorie: string): number {
    return this.matchs.filter(m => 
      (m.categorie === categorie || m.categorie === 'ALL') && !m.enCours
    ).length;
  }

  // ── Couleur forme ────────────────────────
  getFormeColor(result: string): any {
    switch (result) {
      case 'V':
        return { 'background': this.themeService.convocationPrimary };
      case 'N':
        return { 'background': this.themeService.c20Base };
      case 'D':
        return { 'background': this.themeService.primary };
      default:
        return { 'background': this.themeService.Textprincipal + '20' };
    }
  }
}