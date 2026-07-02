import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatchService, Match2 } from '../../../../../Backend/Services/match.service';
import { EquipeService, Equipe } from '../../../../../Backend/Services/equipe.Service';
import { Icon } from '../../icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-get-match',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './get-match.html',
  styleUrls: ['./get-match.css'],
  providers: [DatePipe]
})
export class GetMatch implements OnInit {

  matches: Match2[] = [];
  equipes: Equipe[] = [];

  isLoading = false;
  errorMessage = '';

  equipeMap: Map<string, string> = new Map();
  invalidLogos: Set<string> = new Set();

  private uploadBaseUrl = 'http://localhost:3000/uploads/equipe/';

  // ======================================================
  // 👤 USER CONNECTÉ (LOCALSTORAGE)
  // ======================================================
  userEquipe: string = '';
  userCategorie: string = '';

  constructor(
    private matchService: MatchService,
    private equipeService: EquipeService,
    public themeService: ThemeService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.loadUserFromStorage();   // 👈 AJOUT IMPORTANT
    this.loadData();
    this.buildCalendar();
  }

  // ======================================================
  // 👤 CHARGER USER LOCALSTORAGE
  // ======================================================
  loadUserFromStorage(): void {
    const user = JSON.parse(localStorage.getItem('utilisateur') || '{}');

    this.userEquipe = user?.equipe || '';
    this.userCategorie = user?.categorie || '';
  }

  // ======================================================
  // 🔥 FILTRAGE MATCHS
  // ======================================================
  get filteredMatches(): Match2[] {
    return this.matches.filter(m => {
  
      const matchCategorie = (m.categorie || '').toUpperCase();
      const userEquipe = (this.userEquipe || '').toUpperCase();
  
      // console.log('-------------------------------');
      // console.log('MATCH =>', {
      //   domicile: m.equipeDomicile,
      //   exterieur: m.equipeExterieur,
      //   categorie: m.categorie
      // });
  
      // console.log('USER =>', {
      //   equipe: this.userEquipe,
      //   categorie: this.userCategorie
      // });
  
      // console.log('👉 COMPARAISON :', {
      //   userEquipe,
      //   matchCategorie
      // });
  
      // ======================================================
      // 🔥 RÈGLE PRINCIPALE
      // équipe user = catégorie match
      // ======================================================
      const matchOk = userEquipe === matchCategorie;
  
      // console.log('👉 RESULT FILTRE =>', matchOk);
  
      return matchOk;
    });
  }
  // ======================================================
  // 📥 LOAD DATA
  // ======================================================
  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // console.log('🚀 loadData() lancé');

    this.equipeService.getTeams().subscribe({
      next: (teams: Equipe[]) => {

        // console.log('✅ ÉQUIPES REÇUES =>', teams);

        this.equipes = teams;
        this.equipeMap.clear();

        teams.forEach((e: Equipe) => {
          if (e.nom && e.logo) {
            const logoUrl = this.buildLogoUrl(e.logo);
            this.equipeMap.set(e.nom.toLowerCase().trim(), logoUrl);
          }
        });

        // console.log('🗺️ MAP LOGOS =>', this.equipeMap);

        this.matchService.getMatches().subscribe({
          next: (data: Match2[]) => {

            // console.log('🏆 MATCHS REÇUS =>', data);

            this.matches = data || [];
            this.isLoading = false;

            // console.log('📊 MATCHS STOCKÉS =>', this.matches);
          },
          error: (err) => {
            console.error('❌ ERREUR MATCHS =>', err);
            this.errorMessage = 'Erreur lors du chargement des matchs';
            this.isLoading = false;
          }
        });

      },
      error: (err) => {
        console.error('❌ ERREUR ÉQUIPES =>', err);
        this.errorMessage = 'Erreur lors du chargement des équipes';
        this.isLoading = false;
      }
    });
  }

  // ======================================================
  // 🇫🇷 FORMAT DATE
  // ======================================================
  formatDateFr(date: string | Date): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd MMM yyyy', undefined, 'fr-FR') ?? '';
  }

  // ======================================================
  // 🔥 LOGO
  // ======================================================
  buildLogoUrl(logo: string): string {
    if (!logo) return '';
    if (logo.startsWith('http')) return logo;
    return this.uploadBaseUrl + logo;
  }

  getLogo(nomEquipe: string): string {
    if (!nomEquipe) return '';
    return this.equipeMap.get(nomEquipe.toLowerCase().trim()) || '';
  }

  handleImageError(event: Event, equipeName: string): void {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';

    if (equipeName) {
      this.invalidLogos.add(equipeName.toLowerCase().trim());
    }
  }

  hasInvalidLogo(nomEquipe: string): boolean {
    if (!nomEquipe) return true;
    return this.invalidLogos.has(nomEquipe.toLowerCase().trim());
  }

  // ======================================================
  // 📊 STATS (FILTRÉS USER)
  // ======================================================
  getMatchsEnCours(): number {
    return this.filteredMatches.filter(m => m.statut === 'EN_COURS').length;
  }

  getMatchsTermines(): number {
    return this.filteredMatches.filter(m => m.statut === 'TERMINE').length;
  }

  getMatchsAVenir(): number {
    return this.filteredMatches.filter(m => m.statut === 'A_VENIR').length;
  }

  // ======================================================
  // 🎯 STATUS
  // ======================================================
  getStatusIcon(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'fa-solid fa-play';
      case 'TERMINE': return 'fa-solid fa-flag-checkered';
      case 'A_VENIR': return 'fa-solid fa-clock';
      case 'ANNULE': return 'fa-solid fa-xmark';
      default: return 'fa-solid fa-futbol';
    }
  }

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'A_VENIR': return 'À venir';
      case 'ANNULE': return 'Annulé';
      default: return 'Inconnu';
    }
  }

  // ======================================================
  // 🔤 INITIALES
  // ======================================================
  getInitiales(nom: string): string {
    if (!nom) return '';
    return nom.split(' ').map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2);
  }

  // ======================================================
  // 📅 CALENDRIER
  // ======================================================
  currentMonth: Date = new Date();
  calendarDays: Date[] = [];

  buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    this.calendarDays = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      this.calendarDays.push(new Date(d));
    }
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
    this.buildCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + 1));
    this.buildCalendar();
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  getMatchesByDate(date: Date): Match2[] {
    return this.filteredMatches.filter(m => {
      if (!m.dateMatch) return false;
      return this.isSameDay(new Date(m.dateMatch), date);
    });
  }
}