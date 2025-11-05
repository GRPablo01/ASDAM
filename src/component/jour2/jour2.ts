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
  selector: 'app-jour2',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './jour2.html',
  styleUrls: ['./jour2.css'],
})
export class Jour2 implements OnInit {
  constructor(
    private matchService: MatchService,
    private eventService: EventService
  ) {}

  // ==================== DONNÉES ====================
  hours = Array.from({ length: 14 }, (_, i) =>
    `${(8 + i).toString().padStart(2, '0')}:00`
  );

  categories = ['Entraînement', 'Match', 'Tournoi', 'Réunion', 'Fête'];
  public = [
    'Admin', 'Coach', 'Joueur', 'Invité', 'Tous',
    'U7', 'U9', 'U11', 'U13', 'U15', 'U18', 'U23', 
    'SeniorA', 'SeniorB', 'SeniorD'
  ];

  events: EventItem[] = [];
  matches: Match[] = [];

  today: string = '';
  tomorrow: string = '';
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  currentWeekStart: Date = new Date();

  weekDays: string[] = [];
  monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
    'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // ==================== ÉTAT UI ====================
  showPopup = false;
  isEditing = false;
  isSubmitting = false;
  selectedEvent: EventItem | null = null;
  selectedMatch: Match | null = null;

  showEventPopup = false;
  showMatchPopup = false;

  // ==================== FORMULAIRE ====================
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = '';
  newEventHour = '';
  newEventEndHour = '';
  newEventDescription = '';

  // ==================== UTILISATEUR ====================
  userRole: string = '';
  userTeam = '';
  tousPublics: string[] = [];
  userPublics: string[] = [];
  tousEvents: EventItem[] = [];
  readonly hourHeight = 56;

  // ==================== INIT ====================
  async ngOnInit(): Promise<void> {
    this.today = this.formatDate(new Date());
    this.tomorrow = this.formatDate(new Date(new Date().setDate(new Date().getDate() + 1)));
    this.currentWeekStart = this.getMonday(new Date());

    this.loadUserFromLocalStorage();
    this.setUserAccess();
    this.updateWeekDays();
    await this.loadData();
  }

  // ==================== UTILISATEUR ====================
  private loadUserFromLocalStorage(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (!userStr) {
      this.userRole = '';
      this.userTeam = '';
      return;
    }

    try {
      const user = JSON.parse(userStr);
      this.userTeam = (user.equipe || user.team || '').toString();
      this.userRole = (user.role || '').toString().toLowerCase();
      console.debug('Utilisateur chargé depuis localStorage :', {
        role: this.userRole,
        team: this.userTeam
      });
    } catch (err) {
      console.error('Impossible de parser utilisateur depuis localStorage', err);
      this.userRole = '';
      this.userTeam = '';
    }
  }

  setUserAccess(): void {
    const allPublics = [
      'Admin', 'Coach', 'Joueur', 'Invité', 'Tous',
      'U7', 'U9', 'U11', 'U13', 'U15', 'U18', 'U23',
      'SeniorA', 'SeniorB', 'SeniorD'
    ];

    const role = (this.userRole || '').toLowerCase();
    const team = (this.userTeam || '').toString();

    switch (role) {
      case 'admin':
      case 'super admin':
      case 'superadmin':
        this.userPublics = [...allPublics];
        this.tousEvents = this.events;
        break;
      case 'coach':
        this.userPublics = ['Coach','Tous', ...allPublics.filter(p => p.startsWith('U') || p.startsWith('Senior'))];
        this.tousEvents = this.events.filter(event => this.userPublics.includes(event.level));
        break;
      case 'joueur':
      case 'player':
        this.userPublics = ['Joueur','Tous'];
        if (team) this.userPublics.push(team);
        this.tousEvents = this.events.filter(event => this.userPublics.includes(event.level));
        break;
      default:
        this.userPublics = ['Tous'];
        this.tousEvents = this.events.filter(event => event.level === 'Tous');
        break;
    }
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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }

  // ==================== ÉVÉNEMENTS ====================
  async loadData(): Promise<void> {
    try {
      const [events, matches] = await Promise.all([
        lastValueFrom(this.eventService.getEvents()),
        lastValueFrom(this.matchService.getAllMatches())
      ]);
      this.events = events;
      this.matches = matches;
      this.setUserAccess(); // update filtered events after loading
    } catch (err) {
      console.error('Erreur de chargement :', err);
    }
  }

  getEventsForDay(day: string): EventItem[] {
    const formattedDay = this.formatDate(day);
    let dayEvents = this.events.filter(e => e.day === formattedDay);

    const role = (this.userRole || '').toLowerCase();
    const team = (this.userTeam || '').toLowerCase();

    dayEvents = dayEvents.filter(e => {
      const level = (e.level || '').toLowerCase();
      if (level === 'tous') return true;
      if (role === 'admin' || role === 'super admin') return true;
      if (role === 'coach') return ['coach','tous', team].includes(level) || level.startsWith('u') || level.startsWith('senior');
      if (role === 'joueur') return ['joueur', team].includes(level);
      return false;
    });

    return dayEvents.sort((a, b) => {
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

  getEventColor(evt: EventItem): string {
    const map: Record<string,string> = {
      Entraînement:'bg-blue-800',
      Match:'bg-red-800',
      Tournoi:'bg-yellow-800',
      Réunion:'bg-purple-800',
      Fête:'bg-green-800'
    };
    return map[evt.category] || 'bg-gray-400';
  }

  getEventIcon(evt: EventItem): string {
    const map: Record<string,string> = {
      Entraînement:'fa-solid fa-dumbbell',
      Match:'fa-solid fa-futbol',
      Tournoi:'fa-solid fa-trophy',
      Réunion:'fa-solid fa-calendar',
      Fête:'fa-solid fa-glass-cheers'
    };
    return map[evt.category] || 'fa-solid fa-circle';
  }

  openEventDetails(event: EventItem) {
    this.selectedEvent = event;
    this.showEventPopup = true;
    this.showPopup = false;
    this.isEditing = false;
  }

  closeEventDetails() {
    this.selectedEvent = null;
    this.showEventPopup = false;
  }

  openPopup() {
    if (!this.canEdit()) return;
    this.isEditing = false;
    this.resetForm();
    this.newEventDate = this.formatDate(this.currentWeekStart);
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.isEditing = false;
  }

  canEdit(): boolean {
    return ['coach','admin','super admin'].includes(this.userRole.toLowerCase());
  }

  private resetForm() {
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
    if (!id || !confirm('Voulez-vous vraiment supprimer cet événement ?')) return;
    try {
      await lastValueFrom(this.eventService.deleteEvent(id));
      this.loadData();
    } catch (err) {
      console.error(err);
    }
  }

  // ==================== MATCH ====================
  openMatchDetails(match: Match) {
    this.selectedMatch = match;
    this.showMatchPopup = true;
  }

  closeMatchDetails() {
    this.selectedMatch = null;
    this.showMatchPopup = false;
  }

  isToday(day: string | Date): boolean {
    const dayDate = typeof day === 'string' ? new Date(day) : day;
    const now = new Date();
    return dayDate.getDate() === now.getDate() &&
           dayDate.getMonth() === now.getMonth() &&
           dayDate.getFullYear() === now.getFullYear();
  }

  formatFullDate(dateStr: string): string {
    const d = new Date(dateStr);
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
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
  
}
