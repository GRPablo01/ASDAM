import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatchService, Match2 } from '../../../../../Backend/Services/match.service';
import { EquipeService, Equipe } from '../../../../../Backend/Services/equipe.Service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'app-prochain-match',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon, RouterLink],
  templateUrl: './prochain-match.html',
  styleUrl: './prochain-match.css',
})
export class ProchainMatch implements OnInit {

  matchs: Match2[] = [];
  equipes: Equipe[] = [];
  

  equipesMap: Map<string, Equipe> = new Map();

  currentIndex = 0;

  constructor(
    public themeService: ThemeService,
    private matchService: MatchService,
    private equipeService: EquipeService
  ) {}

  ngOnInit(): void {
    this.getAllEquipes();
  }

  // ================= LOAD MATCHS =================
  getAllMatchs(): void {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        this.matchs = data;
      },
      error: (err) => console.error(err)
    });
  }

  // ================= LOAD EQUIPES =================
  getAllEquipes(): void {
    this.equipeService.getTeams().subscribe({
      next: (data) => {
        this.equipes = data;

        this.equipesMap.clear();

        data.forEach((equipe: Equipe) => {
          if (equipe.nom) {
            this.equipesMap.set(equipe.nom.trim().toLowerCase(), equipe);
          }
        });

        this.getAllMatchs();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= TEAM HELPERS =================
  getEquipeByName(nom?: string): Equipe | undefined {
    if (!nom) return undefined;
    return this.equipesMap.get(nom.trim().toLowerCase());
  }

  getEquipeName(nom?: string): string {
    return this.getEquipeByName(nom)?.nom || nom || 'Équipe inconnue';
  }

  getEquipeLogo(nom?: string): string {
    const equipe = this.getEquipeByName(nom);
    if (!equipe?.logo) return '';
    return `http://localhost:3000/uploads/equipe/${equipe.logo}`;
  }

  // ================= MATCH HELPERS =================
  getDomEquipe(match: any): string {
    return this.getEquipeName(match?.equipeDomicile);
  }

  getDomLogo(match: any): string {
    return this.getEquipeLogo(match?.equipeDomicile);
  }

  getExtEquipe(match: any): string {
    return this.getEquipeName(match?.equipeExterieur);
  }

  getExtLogo(match: any): string {
    return this.getEquipeLogo(match?.equipeExterieur);
  }

  // ================= SLIDER =================
  nextMatch(): void {
    if (this.currentIndex < this.matchs.length - 1) {
      this.currentIndex++;
    }
  }

  prevMatch(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToMatch(i: number): void {
    this.currentIndex = i;
  }

  // ================= STYLE =================
  // get cardStyle() {
  //   return {
  //     background: this.themeService.GlassBackground,
  //     border: '2px solid ' + this.themeService.GlassBorder,
  //     backdropFilter: 'blur(22px) saturate(180%)',
  //     WebkitBackdropFilter: 'blur(22px) saturate(180%)',
  //     boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  //     color: this.themeService.Textprincipal
  //   };
  // }

  // ================= STATUT =================

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';
  
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
  
    const jours = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  
    const jour = jours[d.getDay()];
    const jourNumero = d.getDate();
    const mois = d.toLocaleDateString('fr-FR', { month: 'short' });
  
    return `${jour} ${jourNumero} ${mois}`;
  }


  getStatutBadgeClass(statut?: string): string {
    switch (statut) {
  
      case 'En cours':
        return `
          bg-red-500/20
          border-red-500/40
          text-red-400
        `;
  
      case 'Terminé':
        return `
          bg-gray-500/20
          border-gray-500/40
          text-gray-300
        `;
  
      case 'Programmé':
        return `
          bg-blue-500/20
          border-blue-500/40
          text-blue-400
        `;
  
      case 'Annulé':
        return `
          bg-yellow-500/20
          border-yellow-500/40
          text-yellow-400
        `;
  
      default:
        return `
          bg-white/10
          border-white/20
          text-white
        `;
    }
  }
  
  getStatutIconClass(statut?: string): string {
    switch (statut) {
  
      case 'En cours':
        return 'text-red-500 animate-pulse';
  
      case 'Terminé':
        return 'text-gray-400';
  
      case 'Programmé':
        return 'text-blue-400';
  
      case 'Annulé':
        return 'text-yellow-400';
  
      default:
        return 'text-white';
    }
  }
}