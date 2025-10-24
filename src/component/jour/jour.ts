import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Match, MatchService } from '../../../services/match.service';
import { EventItem, EventService } from '../../../services/event.service';

type Event = EventItem;

function parseHour(h: string): { hour: number; minute: number } {
  const [hh, mm] = h.split(':').map(Number);
  return { hour: hh, minute: mm };
}

@Component({
  selector: 'app-jour',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './jour.html',
  styleUrls: ['./jour.css'],
})
export class Jour implements OnInit {
  constructor(
    private matchService: MatchService,
    private eventService: EventService
  ) {}

  // ==================== DONNÉES ====================
  hours = Array.from({ length: 14 }, (_, i) =>
    `${(8 + i).toString().padStart(2, '0')}:00`
  );

  categories = ['Entraînement', 'Match', 'Tournoi', 'Réunion', 'Fête'];
  levels = [
    'Admin', 'Coach', 'Joueur', 'Invité', 'Tous',
    'U7','U9','U11','U13','U15','U18','U23','SeniorA','SeniorB','SeniorD'
  ];

  events: EventItem[] = [];
  matches: Match[] = [];
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  currentWeekStart = this.getMonday(this.today);

  weekDays: string[] = [];
  monthNames = [
    'Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août',
    'Septembre','Octobre','Novembre','Décembre'
  ];

  // ==================== ÉTAT UI ====================
  showPopup = false;
  isEditing = false;
  isSubmitting = false;
  selectedEvent: EventItem | null = null;
  selectedMatch: Match | null = null;

  // ==================== FORMULAIRE NOUVEL ÉVÉNEMENT ====================
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = '';
  newEventHour = '';
  newEventEndHour = '';
  newEventDescription = '';

  // ==================== UTILISATEUR ====================
  userRole = '';
  userTeam = '';
  readonly hourHeight = 56; // hauteur d’une heure

  // ==================== INIT ====================
  async ngOnInit(): Promise<void> {
    this.loadUserFromLocalStorage();
    this.updateWeekDays();
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const [events, matches] = await Promise.all([
        lastValueFrom(this.eventService.getEvents()),
        lastValueFrom(this.matchService.getAllMatches())
      ]);
      this.events = events;
      this.matches = matches;
    } catch (err) {
      console.error('Erreur de chargement :', err);
    }
  }

  private loadUserFromLocalStorage(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userRole = user.role || '';
        this.userTeam = user.team || '';
      } catch {
        this.userRole = '';
        this.userTeam = '';
      }
    }
  }

  canEdit(): boolean {
    return ['coach', 'admin', 'super admin'].includes(this.userRole.toLowerCase());
  }

  // ==================== CALENDRIER ====================
  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay() || 7;
    date.setDate(date.getDate() - day + 1);
    return date;
  }

  updateWeekDays(): void {
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(this.currentWeekStart);
      d.setDate(d.getDate() + i);
      return this.formatDate(d);
    });
  }

  formatDate(d: Date | string): string {
    const date = typeof d === 'string' ? new Date(d) : d;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  weekLabel(): string {
    const mon = this.currentWeekStart;
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    return `Semaine du ${mon.getDate()} ${this.monthNames[mon.getMonth()]} au ${sun.getDate()} ${this.monthNames[sun.getMonth()]}`;
  }

  goToday(): void {
    const now = new Date();
    this.currentWeekStart = this.getMonday(now);
    this.updateWeekDays();
  }

  jumpToDate(ymd: string): void {
    const d = new Date(ymd);
    this.currentWeekStart = this.getMonday(d);
    this.updateWeekDays();
  }

  prevWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.updateWeekDays();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.updateWeekDays();
  }

  dayNum(day: string): number {
    return day ? parseInt(day.split('-')[2], 10) : 0;
  }

  // ==================== ÉVÉNEMENTS / MATCHS ====================
  getEventsForDay(day: string): EventItem[] {
    const d = this.formatDate(day);
    return this.events
      .filter(e => e.day === d)
      .sort((a, b) => {
        const sa = parseHour(a.hour);
        const sb = parseHour(b.hour);
        return sa.hour * 60 + sa.minute - (sb.hour * 60 + sb.minute);
      });
  }

  getMatchesForDay(day: string): Match[] {
    const d = this.formatDate(day);
    return this.matches
      .filter(m => this.formatDate(m.date) === d)
      .sort((a, b) => {
        const sa = parseHour(a.heureDebut ?? '00:00');
        const sb = parseHour(b.heureDebut ?? '00:00');
        return sa.hour * 60 + sa.minute - (sb.hour * 60 + sb.minute);
      });
  }
  

  // ==================== POSITIONNEMENT ====================
  getEventTopOffset(evt: EventItem): number { return 0; }
  getEventHeight(evt: EventItem): number { return this.hourHeight * 2; }
  matchTop(match: Match): number { return 0; }
  matchHeight(match: Match): number { return this.hourHeight * 2; }

  // ==================== STYLE / ICONES ====================
  getEventColor(evt: EventItem): string {
    const map: Record<string, string> = {
      Entraînement: 'bg-blue-800',
      Match: 'bg-red-800',
      Tournoi: 'bg-yellow-800',
      Réunion: 'bg-purple-800',
      Fête: 'bg-green-800'
    };
    return map[evt.category] || 'bg-gray-400';
  }

  

  getEventIcon(evt: EventItem): string {
    const map: Record<string, string> = {
      Entraînement: 'fa-solid fa-dumbbell',
      Match: 'fa-solid fa-futbol',
      Tournoi: 'fa-solid fa-trophy',
      Réunion: 'fa-solid fa-calendar',
      Fête: 'fa-solid fa-glass-cheers'
    };
    return map[evt.category] || 'fa-solid fa-circle';
  }

  getTimelineForDay(day: string): (EventItem | Match)[] {
    const events = this.getEventsForDay(day);
    const matches = this.getMatchesForDay(day);
    return [...events, ...matches].sort((a, b) => {
      const sa = parseHour((a as any).hour || (a as any).heureDebut);
      const sb = parseHour((b as any).hour || (b as any).heureDebut);
      return sa.hour * 60 + sa.minute - (sb.hour * 60 + sb.minute);
    });
  }

  // ==================== POPUPS ====================
  openPopup(): void {
    if (!this.canEdit()) return;
    this.isEditing = false;
    this.resetForm();
    this.newEventDate = this.formatDate(this.currentWeekStart);
    this.showPopup = true;
  }

  closePopup(): void { this.showPopup = false; this.isEditing = false; }

  openEventDetails(evt: EventItem): void { this.selectedEvent = evt; }
  closeEventDetails(): void { this.selectedEvent = null; }

  openMatchDetails(match: Match): void { this.selectedMatch = match; }
  closeMatchDetails(): void { this.selectedMatch = null; }

  editEvent(evt: EventItem): void {
    this.selectedEvent = { ...evt };
    this.isEditing = true;
    this.newEventDate = evt.day;
    this.newEventHour = evt.hour;
    this.newEventEndHour = evt.endHour;
    this.newEventTitle = evt.title;
    this.newEventCoach = evt.coach;
    this.newEventCategory = evt.category;
    this.newEventLevel = evt.level || this.levels[0];
    this.newEventDescription = evt.description || '';
    this.showPopup = true;
  }

  formatFullDate(dateStr: string): string {
    const d = new Date(dateStr);
    const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()}`;
  }

  submitEvent(): void {
    if (!this.canEdit() || !this.newEventTitle.trim()) return;

    this.isSubmitting = true;
    const payload: EventItem = {
      day: this.newEventDate,
      hour: this.newEventHour,
      endHour: this.newEventEndHour,
      title: this.newEventTitle.trim(),
      coach: this.newEventCoach.trim(),
      category: this.newEventCategory,
      level: this.newEventLevel.trim(),
      duration: 0,
      description: this.newEventDescription
    };

    const action = this.isEditing && this.selectedEvent?._id
      ? this.eventService.updateEvent(this.selectedEvent._id, payload)
      : this.eventService.addEvent(payload);

    action.subscribe({
      next: () => {
        this.loadData();
        this.resetForm();
        this.showPopup = false;
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erreur lors de l’enregistrement :', err);
        this.isSubmitting = false;
      }
    });
  }

  private resetForm(): void {
    this.newEventTitle = '';
    this.newEventCoach = '';
    this.newEventCategory = '';
    this.newEventLevel = '';
    this.newEventDate = '';
    this.newEventHour = '';
    this.newEventEndHour = '';
    this.newEventDescription = '';
    this.selectedEvent = null;
    this.selectedMatch = null;
  }

  async deleteEvent(id?: string) {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer cet événement ?')) return;
  
    try {
      await lastValueFrom(this.eventService.deleteEvent(id));
      this.loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression de l’événement :', error);
    }
  }
}
