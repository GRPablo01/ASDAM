import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatchService, Match2 } from '../../../../../Backend/Services/match.service';
import { EquipeService, Equipe } from '../../../../../Backend/Services/equipe.Service';
import { SeanceService, Seance } from '../../../../../Backend/Services/seance.service';
import { EventService, Evenement } from '../../../../../Backend/Services/event.Service';

import { Icon } from '../../icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [
    CommonModule,
    Icon
  ],
  templateUrl: './planning.html',
  styleUrls: ['./planning.css'],
  providers: [DatePipe]
})
export class Planning implements OnInit {

  // ======================================================
  // MATCHS
  // ======================================================
  matches: Match2[] = [];

  // ======================================================
  // EQUIPES
  // ======================================================
  equipes: Equipe[] = [];

  // ======================================================
  // SEANCES
  // ======================================================
  seances: Seance[] = [];

  // ======================================================
  // EVENEMENTS
  // ======================================================
  evenements: Evenement[] = [];

  // ======================================================
  // UPLOADS EVENEMENTS
  // ======================================================
  private uploadEventBaseUrl = 'http://localhost:3000/uploads/events/';
  invalidEventImages: Set<string> = new Set();

  // ======================================================
  // ÉTAT
  // ======================================================
  isLoading = false;
  errorMessage = '';

  // ======================================================
  // MAPS
  // ======================================================
  equipeMap: Map<string, string> = new Map();
  invalidLogos: Set<string> = new Set();
  private uploadBaseUrl = 'http://localhost:3000/uploads/equipe/';

  // ======================================================
  // CALENDRIER
  // ======================================================
  currentMonth: Date = new Date();
  calendarDays: Date[] = [];

  // ======================================================
  // EXPANSION PAR JOUR
  // ======================================================
  private eventsExpandedMap = new Map<string, boolean>();
  private matchesExpandedMap = new Map<string, boolean>();

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private matchService: MatchService,
    private equipeService: EquipeService,
    private seanceService: SeanceService,
    private eventService: EventService,
    public themeService: ThemeService,
    private datePipe: DatePipe,
    private router: Router,
  ) {}

  // ======================================================
  // ON INIT
  // ======================================================
  ngOnInit(): void {
    this.loadData();
    this.loadEvenements();
    this.buildCalendar();
  }

  // ======================================================
  // EVENEMENTS IMAGES
  // ======================================================
  buildEventImageUrl(image: string | undefined): string {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return this.uploadEventBaseUrl + image;
  }

  handleEventImageError(event: Event, eventId: string | undefined): void {
    if (!eventId) return;
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    this.invalidEventImages.add(eventId);
  }

  hasInvalidEventImage(eventId: string | undefined): boolean {
    if (!eventId) return false;
    return this.invalidEventImages.has(eventId);
  }

  // ======================================================
  // LOAD MATCH + EQUIPES
  // ======================================================
  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.equipeService.getTeams().subscribe({
      next: (teams: Equipe[]) => {
        this.equipes = teams;
        this.equipeMap.clear();

        teams.forEach(e => {
          if (e.nom && e.logo) {
            this.equipeMap.set(
              e.nom.toLowerCase().trim(),
              this.buildLogoUrl(e.logo)
            );
          }
        });

        this.matchService.getMatches().subscribe({
          next: (data: Match2[]) => {
            this.matches = data.filter((match) =>
              match.equipeDomicile === 'ASDAM' ||
              match.equipeExterieur === 'ASDAM'
            );
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Erreur chargement matchs';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur chargement équipes';
        this.isLoading = false;
      }
    });
  }

  // ======================================================
  // LOAD EVENEMENTS
  // ======================================================
  loadEvenements(): void {
    this.eventService.getEvents().subscribe({
      next: (data: Evenement[]) => {
        this.evenements = data || [];
      },
      error: (err) => {
        console.error('Erreur événements', err);
      }
    });
  }

  // ======================================================
  // FORMAT DATE
  // ======================================================
  formatDateFr(date: string | Date): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'dd MMM yyyy', undefined, 'fr-FR') || '';
  }

  // ======================================================
  // LOGOS
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
    this.invalidLogos.add(equipeName.toLowerCase().trim());
  }

  hasInvalidLogo(nomEquipe: string): boolean {
    return this.invalidLogos.has(nomEquipe.toLowerCase().trim());
  }

  // ======================================================
  // STATS MATCHS
  // ======================================================
  getMatchsEnCours(): number {
    return this.matches.filter(m => m.statut === 'en_cours').length;
  }

  getMatchsTermines(): number {
    return this.matches.filter(m => m.statut === 'termine').length;
  }

  getMatchsAVenir(): number {
    return this.matches.filter(m => m.statut === 'programme').length;
  }

  // ======================================================
  // EXPANSION ÉVÉNEMENTS / MATCHS PAR JOUR
  // ======================================================
  hasEventsForDay(day: Date): boolean {
    return this.getEvenementsByDate(day).length > 0;
  }

  hasMatchesForDay(day: Date): boolean {
    return this.getMatchesByDate(day).length > 0;
  }

  getEventsCountForDay(day: Date): number {
    return this.getEvenementsByDate(day).length;
  }

  getMatchesCountForDay(day: Date): number {
    return this.getMatchesByDate(day).length;
  }

  toggleEventsVisibility(day: Date): void {
    const dayKey = this.formatDayKey(day);
    const current = this.eventsExpandedMap.get(dayKey) || false;
    this.eventsExpandedMap.set(dayKey, !current);
  }

  toggleMatchesVisibility(day: Date): void {
    const dayKey = this.formatDayKey(day);
    const current = this.matchesExpandedMap.get(dayKey) || false;
    this.matchesExpandedMap.set(dayKey, !current);
  }

  isEventsExpanded(day: Date): boolean {
    return this.eventsExpandedMap.get(this.formatDayKey(day)) || false;
  }

  isMatchesExpanded(day: Date): boolean {
    return this.matchesExpandedMap.get(this.formatDayKey(day)) || false;
  }

  private formatDayKey(day: Date): string {
    return day.toISOString().split('T')[0];
  }

  // ======================================================
  // STATS SEANCES
  // ======================================================
  getSeancesAujourdHui(): number {
    const today = new Date();
    return this.seances.filter(s => this.isSameDay(new Date(s.date), today)).length;
  }

  getSeancesAVenir(): number {
    return this.seances.filter(s => new Date(s.date) > new Date()).length;
  }

  getSeancesTotal(): number {
    return this.seances.length;
  }

  // ======================================================
  // STATS EVENEMENTS
  // ======================================================
  getEvenementsAujourdHui(): number {
    const today = new Date();
    return this.evenements.filter(e => this.isSameDay(new Date(e.date), today)).length;
  }

  getEvenementsAVenir(): number {
    return this.evenements.filter(e => new Date(e.date) > new Date()).length;
  }

  getEvenementsTotal(): number {
    return this.evenements.length;
  }

  // ======================================================
  // INITIALES
  // ======================================================
  getInitiales(nom: string): string {
    if (!nom) return '';
    return nom.split(' ').map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2);
  }

  // ======================================================
  // CALENDRIER
  // ======================================================
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

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
    this.buildCalendar();
  }

  nextMonth(): void {
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

  // ======================================================
  // ACTIVITÉS DU JOUR (MATCH + SÉANCE + ÉVÉNEMENT)
  // ======================================================
  getActivitesByDate(date: Date) {
    const seances = this.getSeancesByDate(date).map(seance => ({
      ...seance,
      type: 'seance',
      heureTri: seance.heure
    }));

    const matchs = this.getMatchesByDate(date).map(match => ({
      ...match,
      type: 'match',
      heureTri: match.heureMatch || '23:59'
    }));

    const evenements = this.getEvenementsByDate(date).map(evenement => ({
      ...evenement,
      type: 'evenement',
      heureTri: evenement.heureDebut || '23:59'
    }));

    return [...seances, ...matchs, ...evenements].sort((a: any, b: any) => {
      return a.heureTri.localeCompare(b.heureTri);
    });
  }

  getMatchesByDate(date: Date): Match2[] {
    return this.matches.filter(m => {
      if (!m.dateMatch) return false;
      return this.isSameDay(new Date(m.dateMatch), date);
    });
  }

  getSeancesByDate(date: Date): Seance[] {
    return this.seances.filter(s => {
      if (!s.date) return false;
      return this.isSameDay(new Date(s.date), date);
    });
  }

  getEvenementsByDate(date: Date): Evenement[] {
    return this.evenements.filter(e => {
      if (!e.date) return false;
      return this.isSameDay(new Date(e.date), date);
    });
  }

  // ======================================================
  // NAVIGATION
  // ======================================================
  openSeance(seance: any): void {
    if (!seance?._id) return;
    this.router.navigate(['/seance', seance._id]);
  }

  openMatch(match: any): void {
    if (!match?._id) return;
    this.router.navigate(['/match', match._id]);
  }

  openEvenement(evenement: any): void {
    if (!evenement?._id) return;
    this.router.navigate(['/event', evenement._id]);
  }
}