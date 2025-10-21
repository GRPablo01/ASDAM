import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Match, MatchService } from '../../../services/match.service';
import { EventService } from '../../../services/event.service';


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

type ViewMode = 'month' | 'week';

@Component({
  selector: 'app-jour',
  templateUrl: './jour.html',
  styleUrls: ['./jour.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class Jour implements OnInit {

  constructor(private http: HttpClient, private matchService: MatchService,private eventService: EventService) {}

  // ===== Variables calendrier =====
  hours = Array.from({ length: 14 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
  categories = ['Entraînement', 'Match', 'Tournoi', 'Réunion', 'Fête'];
  levels = ['Admin','Coach','Joueur','Invité','Tous','U7','U9','U11','U13','U15','U18','U23','SeniorA','SeniorB','SeniorD'];
  events: EventItem[] = [];
  matches: Match[] = [];

  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  currentWeekStart = this.getMonday(this.today);
  viewMode: ViewMode = 'month';
  monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  monthDays: string[] = [];
  weekDays: string[] = [];

  // ===== Popup =====
  showPopup = false;
  selectedEvent: EventItem | null = null;
  selectedMatch: Match | null = null;
  isEditing = false;

  // ===== Formulaire =====
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = '';
  newEventHour = '';
  newEventEndHour = '';
  newEventDuration = 1;
  newEventDescription = '';

  // ===== Filtres =====
  selectedCategory = '';
  selectedCoach = '';
  searchTerm = '';

  userTeam: string = '';
  userRole: string = '';

  private apiUrl = 'http://localhost:3000/api/events';
  hourHeight = 56; // Unique définition
  isSubmitting: boolean = false;

  weekDayHeaders = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.updateDays();
    this.loadEvents();
    this.loadMatches();
  }

  // ================= AUTH =================
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
    return ['coach','admin','super admin'].includes(this.userRole); 
  }

  // ================= CALENDRIER =================
  updateDays(): void {
    this.monthDays = this.buildMonthDays();
    this.weekDays = this.buildWeekDays();
  }

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay() || 7;
    date.setDate(date.getDate() - day + 1);
    return date;
  }

  buildWeekDays(): string[] {
    const out: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.currentWeekStart);
      d.setDate(d.getDate() + i);
      out.push(this.formatDate(d));
    }
    return out;
  }

  buildMonthDays(): string[] {
    const days: string[] = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDayOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = 0; i < startDayOffset; i++) days.push('');
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(this.formatDate(new Date(this.currentYear, this.currentMonth, i)));
    }
    while (days.length % 7 !== 0) days.push('');
    return days;
  }

  monthLabel(): string { return `${this.monthNames[this.currentMonth]} ${this.currentYear}`; }
  weekLabel(): string {
    const mon = this.currentWeekStart;
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    return `Semaine du ${mon.getDate()} ${this.monthNames[mon.getMonth()]} au ${sun.getDate()} ${this.monthNames[sun.getMonth()]}`;
  }

  prevMonth(): void { 
    if(this.currentMonth === 0){ this.currentMonth = 11; this.currentYear--; } else this.currentMonth--;
    this.updateDays(); 
  }
  nextMonth(): void { 
    if(this.currentMonth === 11){ this.currentMonth = 0; this.currentYear++; } else this.currentMonth++;
    this.updateDays(); 
  }
  prevWeek(): void { 
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7); 
    this.updateDays(); 
  }
  nextWeek(): void { 
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7); 
    this.updateDays(); 
  }

  goToday() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentWeekStart = this.getMonday(today);
    this.updateDays();
  }

  jumpToDate(ym: string) {
    const [y,m] = ym.split('-').map(Number);
    this.currentYear = y;
    this.currentMonth = m-1;
    this.currentWeekStart = this.getMonday(new Date(y,m-1,1));
    this.updateDays();
  }

  formatDate(d: Date | string): string { 
    const date = typeof d === 'string' ? new Date(d) : d;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
  }

  formatFullDate(dateStr: string): string {
    const d = new Date(dateStr);
    const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()}`;
  }



openMatchDetails(m: Match): void   { this.selectedMatch = m; }
closeMatchDetails(): void          { this.selectedMatch = null; }

getTotalCount(day: string): number {
  return (this.getEventsByDay(day)?.length || 0) + (this.getMatchesByDate(day)?.length || 0);
}

trackByDay(index: number, day: string): string { return day; }

  isToday(day: string): boolean { return day === this.formatDate(new Date()); }
  dayName(day: string): string { 
    const names = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']; 
    return day ? names[new Date(day + 'T00:00:00').getDay()] : '';
  }
  dayNum(day: string): number { return day ? parseInt(day.split('-')[2], 10) : 0; }
  isPast(dateStr: string): boolean { return new Date(dateStr + 'T00:00:00') < new Date(); }

  // ================= EVENTS BACKEND =================
  async loadEvents(): Promise<void> {
    try { this.events = await lastValueFrom(this.http.get<EventItem[]>(this.apiUrl)); } 
    catch(e){ console.error(e); }
  }

  async createEvent(evt: EventItem): Promise<void> {
    if(!this.canEdit()) return;
    try { 
      const newEvent = await lastValueFrom(this.http.post<EventItem>(this.apiUrl, evt));
      this.events.push(newEvent);
    } catch(e){ console.error(e); }
  }

  async updateEvent(evt: EventItem): Promise<void> {
    if(!this.canEdit() || !evt._id) return;
    try {
      const updated = await lastValueFrom(this.http.put<EventItem>(`${this.apiUrl}/${evt._id}`, evt));
      this.events = this.events.map(e => e._id === evt._id ? updated : e);
    } catch(e){ console.error(e); }
  }

  async removeEvent(evt: EventItem): Promise<void> {
    if(!this.canEdit() || !evt._id) return;
    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${evt._id}`));
      this.events = this.events.filter(e => e._id !== evt._id);
    } catch(e){ console.error(e); }
  }

  // ================= MATCHES BACKEND =================
  async loadMatches(): Promise<void> {
    try {
      this.matches = await lastValueFrom(this.matchService.getAllMatches());
      console.log('Matches loaded:', this.matches);
    } catch (err) {
      console.error('Erreur récupération matchs', err);
    }
  }

  timeToPixel(hour: string, minute = 0): number {
    const [h, m] = hour.split(':').map(Number);
    return (h * 60 + (m || minute)) * (this.hourHeight / 60);
  }

  durationToPixel(minutes: number): number {
    return minutes * (this.hourHeight / 60);
  }

  eventDuration(evt: any): number {
    const [sh, sm] = evt.hour.split(':').map(Number);
    const [eh, em] = evt.endHour.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  }

  openMatchAsEvent(match: Match) {
    const matchDate = new Date(match.date);
    const startHour = `${String(matchDate.getHours()).padStart(2,'0')}:${String(matchDate.getMinutes()).padStart(2,'0')}`;
    const endDate = new Date(matchDate);
    endDate.setMinutes(endDate.getMinutes() + (match.duree ?? 90));
    const endHour = `${String(endDate.getHours()).padStart(2,'0')}:${String(endDate.getMinutes()).padStart(2,'0')}`;

    const event: EventItem = {
      _id: match._id ?? '',
      day: matchDate.toISOString().split('T')[0],
      hour: startHour,
      endHour: endHour,
      title: `${match.equipeA} vs ${match.equipeB}`,
      description: (match.scoreA != null && match.scoreB != null) ? `Score: ${match.scoreA} - ${match.scoreB}` : '',
      couleur: '#FF0000',
      coach: '',
      category: match.categorie ?? '',
      level: match.typeMatch ?? '',
      duration: match.duree ?? 90
    };

    this.openEventDetails(event);
  }

  matchTopOffset(match: Match): number {
    const matchDate = new Date(match.date);
    return ((matchDate.getHours() - 8) * this.hourHeight) + (matchDate.getMinutes() / 60) * this.hourHeight;
  }

  matchHeight(match: Match): number {
    const duration = match.duree ?? 90;
    return (duration * this.hourHeight) / 60; 
  }

  openMatchPopup(match: Match) {
    this.selectedMatch = match;
    this.selectedEvent = null;
  }

  openEventPopup(evt: EventItem) {
    this.selectedEvent = evt;
    this.selectedMatch = null;
  }

  closePopups() {
    this.selectedMatch = null;
    this.selectedEvent = null;
  }

  getMatchesByDate(dateStr: string): Match[] {
    return this.matches.filter(m => m.date.startsWith(dateStr));
  }

  getMatchesByTeam(team: string): Match[] {
    return this.matches.filter(m => m.equipeA === team || m.equipeB === team);
  }

  // ================= EVENTS ACTIONS =================
  deleteEvent(event: EventItem): void { 
    this.removeEvent(event); 
    this.closeEventDetails(); 
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
    this.newEventDuration = evt.duration;
    this.newEventDescription = evt.description || '';
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.isEditing = false;
  }
  

  openPopup(): void {
    if(!this.canEdit()) return;
    this.isEditing = false;
    this.selectedEvent = null;
    const d = this.viewMode === 'week' ? this.currentWeekStart : new Date(this.currentYear, this.currentMonth, 1);
    this.newEventDate = this.formatDate(d);
    this.newEventHour = '09:00';
    this.newEventEndHour = '10:00';
    this.newEventTitle = '';
    this.newEventCoach = '';
    this.newEventCategory = '';
    this.newEventLevel = this.levels[0];
    this.newEventDuration = 1;
    this.newEventDescription = '';
    this.showPopup = true;
  }

  openEventDetails(evt: EventItem): void { this.selectedEvent = evt; }
  closeEventDetails(): void { if (!this.isEditing) this.selectedEvent = null; }

  getEventsByDay(day: string | Date): EventItem[] {
    const dayStr = typeof day === 'string' ? day : this.formatDate(day);
    return this.events
      .filter(evt => evt.day === dayStr)
      .sort((a,b) => {
        const aMinutes = parseInt(a.hour.split(':')[0])*60 + parseInt(a.hour.split(':')[1]);
        const bMinutes = parseInt(b.hour.split(':')[0])*60 + parseInt(b.hour.split(':')[1]);
        return aMinutes - bMinutes;
      });
  }

  // ================= EVENTS / MATCHES =================
  getEventTopOffset(evt: any): number {
    const [startHour, startMinute] = evt.hour.split(':').map(Number);
    return (startHour - 8) * this.hourHeight + (startMinute / 60) * this.hourHeight;
  }

  getEventHeight(evt: any): number {
    const [startHour, startMinute] = evt.hour.split(':').map(Number);
    const [endHour, endMinute] = evt.endHour.split(':').map(Number);

    const start = startHour + startMinute / 60;
    const end = endHour + endMinute / 60;

    return (end - start) * this.hourHeight;
  }

  addEvent(file?: File): void {
    if (!this.canEdit()) return;
    if (!this.newEventTitle.trim() || !this.newEventLevel.trim()) return;
  
    this.isSubmitting = true;
  
    const newEvent: EventItem = {
      day: this.newEventDate,
      hour: this.newEventHour,
      endHour: this.newEventEndHour,
      title: this.newEventTitle.trim(),
      coach: this.newEventCoach.trim(),
      category: this.newEventCategory,
      level: this.newEventLevel.trim(),
      duration: this.newEventDuration,
      description: this.newEventDescription
    };
  
    if (this.isEditing && this.selectedEvent?._id) {
      // update
      this.eventService.updateEvent(this.selectedEvent._id, newEvent, file).subscribe({
        next: () => {
          this.loadEvents(); // recharge la liste
          this.resetPopup();
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    } else {
      // create
      this.eventService.addEvent(newEvent, file).subscribe({
        next: () => {
          this.loadEvents();
          this.resetPopup();
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }
  
  private resetPopup() {
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
  hotkeys(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement) return;
    switch (e.key) {
      case 'ArrowLeft': this.viewMode === 'month' ? this.prevMonth() : this.prevWeek(); break;
      case 'ArrowRight': this.viewMode === 'month' ? this.nextMonth() : this.nextWeek(); break;
      case 'n':
      case 'N':
        if (this.canEdit()) this.openPopup(); break;
    }
  }

  onEditEvent(evt: EventItem): void {
    this.closeEventDetails();
    this.editEvent(evt);
  }
  
  getEventIcon(evt: EventItem) {
    switch(evt.category) {
      case 'Entraînement': return 'fa-solid fa-dumbbell';
      case 'Match': return 'fa-solid fa-futbol';
      case 'Tournoi': return 'fa-solid fa-trophy';
      case 'Réunion': return 'fa-solid fa-calendar';
      case 'Fête': return 'fa-solid fa-glass-cheers';
      default: return 'fa-solid fa-circle';
    }
  }

  getEventColor(evt: EventItem): string {
    switch(evt.category) {
      case 'Entraînement': return 'bg-blue-800';
      case 'Match': return 'bg-red-800';
      case 'Tournoi': return 'bg-yellow-800';
      case 'Réunion': return 'bg-purple-800';
      case 'Fête': return 'bg-green-800';
      default: return 'bg-gray-400';
    }
  }

  

  
  showCreatePopup = false;
newEvent: any = {}; // ou interface Event

}
