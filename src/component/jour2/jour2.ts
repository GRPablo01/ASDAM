// jour2.ts (ou jour2.component.ts)
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom, Subscription, interval } from 'rxjs';
import { Match, MatchService } from '../../../services/match.service';
import { EventService } from '../../../services/event.service';
import { DatePipe } from '@angular/common';

interface EventItem {
  _id?: string;
  day: string;
  hour: string;
  endHour: string;
  title: string;
  coach: string;
  category: string;
  level: string;
  duration: number;
  description?: string;
  couleur?: string;
}

function parseHour(h: string): { hour: number; minute: number } {
  const [hh = '0', mm = '0'] = (h || '').split(':');
  const hhN = parseInt(hh, 10) || 0;
  const mmN = parseInt(mm, 10) || 0;
  return { hour: hhN, minute: mmN };
}

@Component({
  selector: 'app-jour2',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './jour2.html',
  styleUrls: ['./jour2.css'],
  providers: [DatePipe]
})
export class Jour implements OnInit {
  private refreshSub?: Subscription;
  constructor(
    private http: HttpClient,
    private matchService: MatchService,
    private eventService: EventService
  ) {}

  hours = Array.from({ length: 14 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
  categories = ['Entraînement', 'Match', 'Tournoi', 'Réunion', 'Fête'];
  levels = ['Admin','Coach','Joueur','Invité','Tous','U7','U9','U11','U13','U15','U18','U23','SeniorA','SeniorB','SeniorD'];
  events: EventItem[] = [];
  matches: Match[] = [];

  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  currentWeekStart = this.getMonday(this.today);
  viewMode: 'month' | 'week' = 'month';

  monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  weekDayHeaders = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

  monthDays: string[] = [];
  weekDays: string[] = [];

  showPopup = false;
  isEditing = false;
  isSubmitting = false;

  selectedEvent: EventItem | null = null;
  selectedMatch: Match | null = null;

  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = '';
  newEventHour = '';
  newEventEndHour = '';
  newEventDescription = '';

  userRole = '';
  userTeam = '';

  private apiUrl = 'http://localhost:3000/api/events';
  readonly hourHeight = 56;

  // helper dates for template header
  get currentDateStr(): string {
    return this.formatDate(this.today);
  }
  get nextDateStr(): string {
    const d = new Date(this.today);
    d.setDate(d.getDate() + 1);
    return this.formatDate(d);
  }

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.updateDays();
    this.loadEvents();
    this.loadMatches();

    // 🔁 Rafraîchissement automatique toutes les 10 secondes
    this.refreshSub = interval(10000).subscribe(() => {
      this.loadEvents();
      this.loadMatches();
    });
  }


  // ================= AUTH =================
  private loadUserFromLocalStorage(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userRole = (user.role || '').toString().toLowerCase();
        this.userTeam = user.team || '';
      } catch {
        this.userRole = '';
        this.userTeam = '';
      }
    }
  }

  canEdit(): boolean {
    return ['coach', 'admin', 'super admin'].includes(this.userRole);
  }

  // ================= CALENDRIER =================
  updateDays(): void {
    this.monthDays = this.buildMonthDays();
    this.weekDays = this.buildWeekDays();
  }

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay() === 0 ? 7 : date.getDay();
    date.setDate(date.getDate() - day + 1);
    date.setHours(0,0,0,0);
    return date;
  }

  buildWeekDays(): string[] {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(this.currentWeekStart);
      d.setDate(d.getDate() + i);
      return this.formatDate(d);
    });
  }

  buildMonthDays(): string[] {
    const days: string[] = [];
    const first = new Date(this.currentYear, this.currentMonth, 1);
    const last = new Date(this.currentYear, this.currentMonth + 1, 0);
    const offset = first.getDay() === 0 ? 6 : first.getDay() - 1;

    for (let i = 0; i < offset; i++) days.push('');
    for (let i = 1; i <= last.getDate(); i++) days.push(this.formatDate(new Date(this.currentYear, this.currentMonth, i)));
    while (days.length % 7 !== 0) days.push('');

    return days;
  }

  formatDate(d: Date | string): string {
    const date = typeof d === 'string' ? new Date(d) : d;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  formatFullDate(dateStr: string): string {
    const d = new Date(dateStr);
    const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()}`;
  }

  monthLabel(): string {
    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
  }

  weekLabel(): string {
    const mon = this.currentWeekStart;
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    return `Semaine du ${mon.getDate()} ${this.monthNames[mon.getMonth()]} au ${sun.getDate()} ${this.monthNames[sun.getMonth()]}`;
  }

  goToday(): void {
    const t = new Date();
    this.currentMonth = t.getMonth();
    this.currentYear = t.getFullYear();
    this.currentWeekStart = this.getMonday(t);
    this.updateDays();
  }

  jumpToDate(ym: string): void {
    const [y, m] = ym.split('-').map(Number);
    if (!y || !m) return;
    this.currentYear = y;
    this.currentMonth = m - 1;
    this.currentWeekStart = this.getMonday(new Date(y, m - 1, 1));
    this.updateDays();
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else this.currentMonth--;
    this.updateDays();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else this.currentMonth++;
    this.updateDays();
  }

  prevWeek(): void {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.updateDays();
  }

  nextWeek(): void {
    this.currentWeekStart = new Date(this.currentWeekStart);
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.updateDays();
  }

  isToday(day: string): boolean {
    return day === this.formatDate(new Date());
  }

  dayName(day: string): string {
    if (!day) return '';
    return ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][new Date(day + 'T00:00:00').getDay()];
  }

  dayNum(day: string): number {
    return day ? parseInt(day.split('-')[2], 10) : 0;
  }

  isPast(dateStr: string): boolean {
    return new Date(dateStr + 'T00:00:00') < new Date();
  }

  // ================= EVENTS =================
  async loadEvents(): Promise<void> {
    try {
      // utilise l'API HTTP directe (fallback si EventService différent)
      const res = await lastValueFrom(this.http.get<EventItem[]>(this.apiUrl));
      this.events = Array.isArray(res) ? res : [];
    } catch (e) {
      console.error('loadEvents error', e);
      this.events = [];
    }
  }

  async createEvent(evt: EventItem): Promise<void> {
    if (!this.canEdit()) return;
    try {
      const newEvent = await lastValueFrom(this.http.post<EventItem>(this.apiUrl, evt));
      if (newEvent) this.events.push(newEvent);
    } catch (e) {
      console.error('createEvent error', e);
    }
  }

  async updateEvent(evt: EventItem): Promise<void> {
    if (!this.canEdit() || !evt._id) return;
    try {
      const updated = await lastValueFrom(this.http.put<EventItem>(`${this.apiUrl}/${evt._id}`, evt));
      this.events = this.events.map(e => e._id === evt._id ? updated : e);
    } catch (e) {
      console.error('updateEvent error', e);
    }
  }

  async removeEvent(evt: EventItem): Promise<void> {
    if (!this.canEdit() || !evt._id) return;
    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${evt._id}`));
      this.events = this.events.filter(e => e._id !== evt._id);
    } catch (e) {
      console.error('removeEvent error', e);
    }
  }

  // ================= MATCHES =================
  async loadMatches(): Promise<void> {
    try {
      this.matches = await lastValueFrom(this.matchService.getAllMatches());
    } catch (e) {
      console.error('loadMatches error', e);
      this.matches = [];
    }
  }

  getMatchesByDate(dateStr: string): Match[] {
    if (!dateStr) return [];
    return this.matches.filter(m => (m.date || '').startsWith(dateStr));
  }

  getMatchesByTeam(team: string): Match[] {
    return this.matches.filter(m => m.equipeA === team || m.equipeB === team);
  }

  // ================= UI HELPERS =================
  getEventsByDay(day: string | Date): EventItem[] {
    const dayStr = typeof day === 'string' ? day : this.formatDate(day);
    return this.events
      .filter(e => e && e.day === dayStr)
      .sort((a, b) => {
        const aMin = parseHour(a.hour).hour * 60 + parseHour(a.hour).minute;
        const bMin = parseHour(b.hour).hour * 60 + parseHour(b.hour).minute;
        return aMin - bMin;
      });
  }

  getEventTopOffset(evt: EventItem): number {
    const { hour, minute } = parseHour(evt.hour);
    return (hour - 8) * this.hourHeight + (minute / 60) * this.hourHeight;
  }

  getEventHeight(evt: EventItem): number {
    const start = parseHour(evt.hour);
    const end = parseHour(evt.endHour);
    const startH = start.hour + start.minute / 60;
    const endH = end.hour + end.minute / 60;
    const durationH = Math.max(0, endH - startH);
    return durationH * this.hourHeight;
  }

  matchTopOffset(match: Match): number {
    if (!match || !match.date) return 0;
    const d = new Date(match.date);
    return (d.getHours() - 8) * this.hourHeight + (d.getMinutes() / 60) * this.hourHeight;
  }

  matchHeight(match: Match): number {
    return ((match.duree ?? 90) * this.hourHeight) / 60;
  }

  getEventIcon(evt: EventItem): string {
    const map: Record<string, string> = {
      'Entraînement': 'fa-solid fa-dumbbell',
      'Match': 'fa-solid fa-futbol',
      'Tournoi': 'fa-solid fa-trophy',
      'Réunion': 'fa-solid fa-calendar',
      'Fête': 'fa-solid fa-glass-cheers',
    };
    return map[evt.category] || 'fa-solid fa-circle';
  }

  getEventColor(evt: EventItem): string {
    const map: Record<string, string> = {
      'Entraînement': 'bg-blue-800',
      'Match': 'bg-red-800',
      'Tournoi': 'bg-yellow-800',
      'Réunion': 'bg-purple-800',
      'Fête': 'bg-green-800',
    };
    return map[evt.category] || 'bg-gray-400';
  }

  // ================= POPUP ACTIONS =================
  openPopup(): void {
    if (!this.canEdit()) return;
    this.isEditing = false;
    this.selectedEvent = null;
    const d = this.viewMode === 'week' ? this.currentWeekStart : new Date(this.currentYear, this.currentMonth, 1);
    this.newEventDate = this.formatDate(d);
    this.newEventHour = '09:00';
    this.newEventEndHour = '10:00';
    this.newEventTitle = '';
    this.newEventCoach = '';
    this.newEventCategory = this.categories[0] || '';
    this.newEventLevel = this.levels[0] || '';
    this.newEventDescription = '';
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.isEditing = false;
  }

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

  deleteEvent(evt: EventItem | null): void {
    if (!evt) return;
    this.removeEvent(evt);
    this.selectedEvent = null;
  }

  openEventDetails(evt: EventItem): void {
    this.selectedEvent = evt;
  }

  closeEventDetails(): void {
    this.selectedEvent = null;
  }

  openMatchDetails(match: Match): void {
    this.selectedMatch = match;
  }

  closeMatchDetails(): void {
    this.selectedMatch = null;
  }

  addEvent(): void {
    if (!this.canEdit() || !this.newEventTitle.trim() || !this.newEventLevel.trim()) return;

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
      description: this.newEventDescription,
    };

    // si édition -> update via eventService si possible, sinon fallback HTTP
    if (this.isEditing && this.selectedEvent && this.selectedEvent._id) {
      // preferer EventService si présent
      if (this.eventService && typeof this.eventService.updateEvent === 'function') {
        this.eventService.updateEvent(this.selectedEvent._id, payload).subscribe({
          next: () => { this.loadEvents(); this.resetPopup(); },
          error: (err) => { console.error(err); this.isSubmitting = false; }
        });
      } else {
        // fallback direct
        this.updateEvent({ ...payload, _id: this.selectedEvent._id });
        this.resetPopup();
      }
    } else {
      // création
      if (this.eventService && typeof this.eventService.addEvent === 'function') {
        this.eventService.addEvent(payload).subscribe({
          next: () => { this.loadEvents(); this.resetPopup(); },
          error: (err) => { console.error(err); this.isSubmitting = false; }
        });
      } else {
        // fallback direct
        this.createEvent(payload).then(() => this.resetPopup()).catch(err => {
          console.error(err);
          this.isSubmitting = false;
        });
      }
    }
  }

  private resetPopup(): void {
    this.isSubmitting = false;
    this.showPopup = false;
    this.isEditing = false;
    this.newEventTitle = '';
    this.newEventCoach = '';
    this.newEventCategory = '';
    this.newEventLevel = '';
    this.newEventDate = '';
    this.newEventHour = '';
    this.newEventEndHour = '';
    this.newEventDescription = '';
  }

  @HostListener('window:keydown', ['$event'])
  hotkeys(e: KeyboardEvent): void {
    if (e.target instanceof HTMLInputElement || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowLeft':
        this.viewMode === 'month' ? this.prevMonth() : this.prevWeek();
        break;
      case 'ArrowRight':
        this.viewMode === 'month' ? this.nextMonth() : this.nextWeek();
        break;
      case 'n':
      case 'N':
        if (this.canEdit()) this.openPopup();
        break;
    }
  }

  
}
