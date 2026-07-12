import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatchService,
  Match2
} from '../../../../../Backend/Services/match.service';

import {
  EquipeService,
  Equipe
} from '../../../../../Backend/Services/equipe.Service';
import { Icon } from "../../icon/icon";
import { ThemeService } from '../../../../../Backend/Services/theme.service';


// ======================================
// TYPES
// ======================================

type MatchStatus = 'programme' | 'en_cours' | 'termine';

interface MatchTimer {
  matchId: string;
  minutes: number;
  seconds: number;
  intervalId: ReturnType<typeof setInterval>;
}


@Component({
  selector: 'app-view-match',
  standalone: true,
  imports: [
    CommonModule,
    Icon
],
  templateUrl: './view-match.html',
  styleUrl: './view-match.css',
})
export class ViewMatch implements OnInit, OnDestroy {


  // ======================================
  // DONNEES
  // ======================================

  matchs: Match2[] = [];
  matchsFiltres: Match2[] = [];

  equipes: Equipe[] = [];
  equipesMap: Map<string, Equipe> = new Map();

  isLoadingMatch = true;
  isLoadingEquipe = true;

  // Filtre actif
  filtreActif: MatchStatus | 'tous' = 'tous';

  // Timers actifs
  private timers: Map<string, MatchTimer> = new Map();

  // Vérification automatique des statuts
  private autoStatusInterval?: ReturnType<typeof setInterval>;

  // Role de l'utilisateur connecté
  userRole: string = '';


  constructor(
    private matchService: MatchService,
    private equipeService: EquipeService,
    public themeService: ThemeService,
  ) {}



  // ======================================
  // INIT
  // ======================================

  ngOnInit(): void {
    this.recupererRoleUtilisateur();
    this.loadEquipes();
    this.loadMatchs();
    // Activation du contrôle automatique
    this.demarrerVerificationAutomatique();
  }

  // ======================================
  // ROLE UTILISATEUR
  // ======================================

  /**
   * Récupère le rôle de l'utilisateur depuis le localStorage.
   * Cherche dans les clés courantes : 'role', 'userRole', 'user'.
   */
  recupererRoleUtilisateur(): void {
    // Essayer différentes clés possibles dans le localStorage
    const role = localStorage.getItem('utilisateur')
      || localStorage.getItem('utilisateur')
      || localStorage.getItem('utilisateur');

    if (role) {
      try {
        // Si c'est un JSON (ex: user stocké en objet)
        const parsed = JSON.parse(role);
        this.userRole = parsed.role || parsed.userRole || parsed.type || role;
      } catch {
        // Si c'est une string simple
        this.userRole = role.toLowerCase().trim();
      }
    }
  }

  /**
   * Vérifie si l'utilisateur peut changer le statut d'un match.
   * Seuls admin et superadmin ont ce droit.
   */
  get canChangeStatus(): boolean {
    const role = this.userRole.toLowerCase();
    return role === 'admin' || role === 'superadmin';
  }



  // ======================================
  // DESTROY
  // ======================================

  ngOnDestroy(): void {
    // Nettoyage timers matchs
    this.timers.forEach((timer) => {
      clearInterval(timer.intervalId);
    });
    this.timers.clear();

    // Nettoyage surveillance automatique
    if (this.autoStatusInterval) {
      clearInterval(this.autoStatusInterval);
    }
  }



  // ======================================
  // RECUPERATION EQUIPES
  // ======================================

  loadEquipes(): void {
    this.equipeService.getTeams()
      .subscribe({
        next: (data) => {
          this.equipes = data;
          this.buildEquipesMap();
          this.isLoadingEquipe = false;
        },
        error: (err) => {
          this.isLoadingEquipe = false;
        }
      });
  }


  /**
   * Construit la Map des équipes indexées par nom (lowercase trim)
   */
  buildEquipesMap(): void {
    this.equipesMap.clear();
    this.equipes.forEach((equipe) => {
      const nom = (equipe.nom || '').trim().toLowerCase();
      if (nom) {
        this.equipesMap.set(nom, equipe);
      }
    });
  }



  // ======================================
  // RECUPERATION MATCHS
  // ======================================

  loadMatchs(): void {
    this.matchService.getMatches()
      .subscribe({
        next: (data) => {
          this.matchs = data;
          this.appliquerFiltre();

          // Relancer les timers pour les matchs en cours
          this.matchs.forEach((match) => {
            if (match.statut === 'en_cours') {
              this.demarrerTimer(match);
            }
          });

          this.isLoadingMatch = false;
        },
        error: (err) => {
          this.isLoadingMatch = false;
        }
      });
  }


  // ======================================
  // GESTION AUTOMATIQUE STATUT MATCH
  // ======================================

  demarrerVerificationAutomatique(): void {
    // Vérification toutes les 30 secondes
    this.autoStatusInterval = setInterval(() => {
      this.verifierStatutsAutomatiques();
    }, 30000);
  }

  verifierStatutsAutomatiques(): void {
    const maintenant = new Date();

    this.matchs.forEach((match) => {
      if (!match.dateMatch || !match.heureMatch) {
        return;
      }

      const debutMatch = new Date(
        `${match.dateMatch}T${match.heureMatch}`
      );

      const finMatch = new Date(
        debutMatch.getTime() + (90 * 60 * 1000)
      );

      // Avant le match
      if (maintenant < debutMatch) {
        if (match.statut !== 'programme') {
          this.updateStatutAutomatique(
            match,
            'programme'
          );
        }
      }

      // Match en cours
      else if (
        maintenant >= debutMatch &&
        maintenant < finMatch
      ) {
        if (match.statut !== 'en_cours') {
          this.updateStatutAutomatique(
            match,
            'en_cours'
          );
        }
      }

      // Match terminé
      else if (maintenant >= finMatch) {
        if (match.statut !== 'termine') {
          this.updateStatutAutomatique(
            match,
            'termine'
          );
        }
      }
    });
  }

  updateStatutAutomatique(
    match: Match2,
    nouveauStatut: MatchStatus
  ): void {
    const ancienStatut = match.statut;

    // Modification locale
    match.statut = nouveauStatut;

    if (nouveauStatut === 'en_cours') {
      this.demarrerTimer(match);
    }

    if (nouveauStatut === 'termine') {
      this.arreterTimer(match._id!);
    }

    this.matchService.updateMatch(
      match._id!,
      {
        statut: nouveauStatut
      } as Partial<Match2>
    )
    .subscribe({
      next:(response)=>{
        this.appliquerFiltre();
      },
      error:(err)=>{
        // rollback
        match.statut = ancienStatut;
      }
    });
  }




  // ======================================
  // FILTRES
  // ======================================

  get filtres(): { label: string; valeur: MatchStatus | 'tous'; couleur: string }[] {
    return [
      { label: 'Tous', valeur: 'tous', couleur: 'bg-slate-600' },
      { label: 'Programmé', valeur: 'programme', couleur: 'bg-amber-500' },
      { label: 'En cours', valeur: 'en_cours', couleur: 'bg-emerald-500' },
      { label: 'Terminé', valeur: 'termine', couleur: 'bg-rose-500' },
    ];
  }

  changerFiltre(filtre: MatchStatus | 'tous'): void {
    this.filtreActif = filtre;
    this.appliquerFiltre();
  }

  appliquerFiltre(): void {
    if (this.filtreActif === 'tous') {
      this.matchsFiltres = [...this.matchs];
    } else {
      this.matchsFiltres = this.matchs.filter(
        (m) => m.statut === this.filtreActif
      );
    }
  }

  getNombreMatchsParStatut(statut: MatchStatus | 'tous'): number {
    if (statut === 'tous') {
      return this.matchs.length;
    }
    return this.matchs.filter((m) => m.statut === statut).length;
  }




  // ======================================
  // CHANGEMENT DE STATUT (PROTÉGÉ PAR RÔLE)
  // ======================================

  changerStatut(match: Match2, nouveauStatut: MatchStatus): void {
    // Vérification des droits
    if (!this.canChangeStatus) {
      alert(
        'Vous n\'avez pas les droits pour changer le statut d\'un match.'
      );
      return;
    }

    if (match.statut === nouveauStatut) {
      return;
    }

    const ancienStatut = match.statut;

    // Mise à jour locale immédiate
    match.statut = nouveauStatut;

    // Gestion du timer
    if (nouveauStatut === 'en_cours') {
      this.demarrerTimer(match);
    }
    else if (ancienStatut === 'en_cours') {
      this.arreterTimer(match._id!);
    }

    const payload = {
      statut: nouveauStatut
    };

    // Mise à jour BDD
    this.matchService
      .updateMatch(
        match._id!,
        payload as Partial<Match2>
      )
      .subscribe({
        next: (response) => {
          this.appliquerFiltre();
        },
        error: (err) => {
          // Rollback en cas d'erreur
          match.statut = ancienStatut;
          this.appliquerFiltre();
        }
      });
  }



  // ======================================
  // TIMER MATCH EN COURS
  // ======================================

  demarrerTimer(match: Match2): void {
    const matchId = match._id!;

    if (!matchId) {
      return;
    }

    // Empêche de créer plusieurs timers
    if (this.timers.has(matchId)) {
      return;
    }

    const timer: MatchTimer = {
      matchId,
      minutes: 0,
      seconds: 0,
      intervalId: setInterval(() => {
        if (!match.dateMatch || !match.heureMatch) {
          return;
        }

        /*
          Exemple :
          dateMatch = 2026-07-12
          heureMatch = 22:28

          devient :

          2026-07-12T22:28:00
        */

        const debutMatch = new Date(
          `${match.dateMatch}T${match.heureMatch}:00`
        );

        const maintenant = new Date();

        const difference =
          maintenant.getTime()
          -
          debutMatch.getTime();

        // Si le match n'a pas commencé
        if (difference < 0) {
          timer.minutes = 0;
          timer.seconds = 0;
          return;
        }

        const secondesTotal =
          Math.floor(
            difference / 1000
          );

        const minutes =
          Math.floor(
            secondesTotal / 60
          );

        const secondes =
          secondesTotal % 60;

        timer.minutes = minutes;
        timer.seconds = secondes;

        match.minutesEcoulees = minutes;
        match.secondesEcoulees = secondes;

        // Après 90 minutes
        if(minutes >= 90){
          this.arreterTimer(matchId);

          if(match.statut !== 'termine') {
            this.updateStatutAutomatique(
              match,
              'termine'
            );
          }
        }

      },1000)
    };

    this.timers.set(
      matchId,
      timer
    );
  }

  arreterTimer(matchId: string): void {
    const timer = this.timers.get(matchId);

    if (timer) {
      clearInterval(timer.intervalId);
      this.timers.delete(matchId);
    }
  }

  getTimerDisplay(match: Match2): string {
    if(
      !match.dateMatch ||
      !match.heureMatch
    ){
      return '00:00';
    }

    const debutMatch = new Date(
      `${match.dateMatch}T${match.heureMatch}:00`
    );

    const maintenant = new Date();

    const difference =
      maintenant.getTime()
      -
      debutMatch.getTime();

    if(difference < 0){
      return '00:00';
    }

    const secondesTotal =
      Math.floor(
        difference / 1000
      );

    const minutes =
      Math.floor(
        secondesTotal / 60
      );

    const secondes =
      secondesTotal % 60;

    return `${minutes
      .toString()
      .padStart(2,'0')}
:
${secondes
      .toString()
      .padStart(2,'0')}`;
  }



  // ======================================
  // TEAM HELPERS (REFACTORISÉS)
  // ======================================

  /**
   * Récupère une équipe par son nom (insensible à la casse et aux espaces)
   */
  getEquipeByName(nom?: string): Equipe | undefined {
    if (!nom) return undefined;
    return this.equipesMap.get(nom.trim().toLowerCase());
  }

  /**
   * Retourne le nom d'une équipe à partir de son nom de référence
   */
  getEquipeName(nom?: string): string {
    return this.getEquipeByName(nom)?.nom || nom || 'Équipe inconnue';
  }

  /**
   * Retourne l'URL du logo d'une équipe à partir de son nom de référence
   */
  getEquipeLogo(nom?: string): string {
    const equipe = this.getEquipeByName(nom);
    if (!equipe?.logo) return 'assets/default-team.png';
    return `http://localhost:3000/uploads/equipe/${equipe.logo}`;
  }



  // ======================================
  // MATCH HELPERS (NOUVEAUX)
  // ======================================

  /**
   * Retourne le nom de l'équipe domicile
   */
  getDomEquipe(match: any): string {
    return this.getEquipeName(match?.equipeDomicile);
  }

  /**
   * Retourne l'URL du logo de l'équipe domicile
   */
  getDomLogo(match: any): string {
    return this.getEquipeLogo(match?.equipeDomicile);
  }

  /**
   * Retourne le nom de l'équipe extérieur
   */
  getExtEquipe(match: any): string {
    return this.getEquipeName(match?.equipeExterieur);
  }

  /**
   * Retourne l'URL du logo de l'équipe extérieur
   */
  getExtLogo(match: any): string {
    return this.getEquipeLogo(match?.equipeExterieur);
  }



  // ======================================
  // ANCIENS HELPERS (DÉPRÉCIÉS - GARDÉS POUR COMPATIBILITÉ)
  // ======================================

  /**
   * @deprecated Utilisez getEquipeByName() à la place
   */
  getEquipe(equipeRef: number | string | undefined | null): Equipe | undefined {
    if (equipeRef == null || equipeRef === '') {
      return undefined;
    }
    if (!this.equipes || this.equipes.length === 0) {
      return undefined;
    }
    // Fallback sur recherche par nom
    if (typeof equipeRef === 'string') {
      return this.getEquipeByName(equipeRef);
    }
    // Recherche par ID numérique dans la liste
    const numRef = Number(equipeRef);
    return this.equipes.find(e => Number(e._id) === numRef);
  }

  /**
   * @deprecated Utilisez getEquipeName() à la place
   */
  getNomEquipe(equipeRef: number | string | undefined | null): string {
    if (equipeRef == null || equipeRef === '') {
      return 'Équipe inconnue';
    }
    if (typeof equipeRef === 'string') {
      return this.getEquipeName(equipeRef);
    }
    const equipe = this.getEquipe(equipeRef);
    return equipe?.nom || 'Équipe inconnue';
  }

  /**
   * @deprecated Utilisez getEquipeLogo() à la place
   */
  getLogoEquipe(equipeRef: number | string | undefined | null): string {
    if (equipeRef == null || equipeRef === '') {
      return 'assets/default-team.png';
    }
    if (typeof equipeRef === 'string') {
      return this.getEquipeLogo(equipeRef);
    }
    const equipe = this.getEquipe(equipeRef);
    if (!equipe?.logo) return 'assets/default-team.png';
    return `http://localhost:3000/uploads/equipe/${equipe.logo}`;
  }



  // ======================================
  // COULEUR STATUT
  // ======================================

  getStatutCouleur(statut: string | undefined): string {
    switch (statut) {
      case 'programme':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'en_cours':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'termine':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  }

  getStatutLabel(statut: string | undefined): string {
    switch (statut) {
      case 'programme':
        return 'Programmé';
      case 'en_cours':
        return 'En cours';
      case 'termine':
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  }
}