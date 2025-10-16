import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

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
}

type ViewMode = 'month' | 'week';

@Component({
  selector: 'app-jour-c',
  templateUrl: './jour-c.html',
  styleUrls: ['./jour-c.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class JourC implements OnInit {

  constructor(private http: HttpClient) {}

  // ===== Variables calendrier =====
  hours = Array.from({ length: 14 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
  categories = ['Entraînement', 'Match', 'Tournoi', 'Réunion', 'Fête'];
  levels = ['Admin','Coach','Joueur','Invité','Tous','U7','U9','U11','U13','U15','U18','U23','SeniorA','SeniorB','SeniorD'];
  events: EventItem[] = [];

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


  // ===== Auth & API =====
  userRole: string = '';
  private apiUrl = 'http://localhost:3000/api/events';
  hourHeight = 56;

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.updateDays();
    this.loadEvents();
  }

  // ===== Auth =====
  private loadUserFromLocalStorage(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userRole = user.role || '';
        this.userTeam = user.team || ''; // <-- récupère l'équipe de l'utilisateur
      } catch {
        this.userRole = '';
        this.userTeam = '';
      }
    }
  }


  canEdit(): boolean { 
    return ['coach','admin','super admin'].includes(this.userRole); 
  }

  // ===== Gestion calendrier =====
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
  
    const jourNom = jours[d.getDay()];
    const jourNum = d.getDate();
    const moisNom = mois[d.getMonth()];
    const annee = d.getFullYear();
  
    return `${jourNom} ${jourNum} ${moisNom} ${annee}`;
  }
  

  isToday(day: string): boolean { return day === this.formatDate(new Date()); }
  dayName(day: string): string { 
    const names = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']; 
    return day ? names[new Date(day + 'T00:00:00').getDay()] : '';
  }
  dayNum(day: string): number { return day ? parseInt(day.split('-')[2], 10) : 0; }

  // ===== Backend =====
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

  // ===== Actions popup =====
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

  // getEventsByDay(day: string | Date): EventItem[] {
  //   const dayStr = typeof day === 'string' ? day : this.formatDate(day);
  //   return this.events.filter(evt => evt.day === dayStr)
  //     .sort((a,b) => parseInt(a.hour.split(':')[0])*60+parseInt(a.hour.split(':')[1]) - (parseInt(b.hour.split(':')[0])*60+parseInt(b.hour.split(':')[1])));
  // }
  getEventsByDay(day: string | Date): EventItem[] {
    const dayStr = typeof day === 'string' ? day : this.formatDate(day);
  
    return this.events
      .filter(evt => {
        // Filtre par jour
        if (evt.day !== dayStr) return false;
  
        // Filtre par rôle
        switch(this.userRole) {
          case 'joueur':
            return ['Tous', 'Joueur', this.userTeam].includes(evt.level);
          case 'coach':
            return ['Tous', 'Coach','U7','U9','U11','U13','U15','U18','U23','SeniorA','SeniorB','SeniorD'].includes(evt.level);
          case 'invit':
          case 'invité':
            return ['Tous','Invité'].includes(evt.level);
          case 'admin':
          case 'super admin':
            return true; // affiche tout
          default:
            return false; // par défaut rien
        }
      })
      .sort((a,b) => {
        const aMinutes = parseInt(a.hour.split(':')[0])*60 + parseInt(a.hour.split(':')[1]);
        const bMinutes = parseInt(b.hour.split(':')[0])*60 + parseInt(b.hour.split(':')[1]);
        return aMinutes - bMinutes;
      });
  }
  

  getEventTopOffset(evt: EventItem): number {
    const startHour = parseInt(evt.hour.split(':')[0], 10);
    const startMinutes = parseInt(evt.hour.split(':')[1], 10);
    return ((startHour - 8) * this.hourHeight) + (startMinutes / 60) * this.hourHeight;
  }

  getEventHeight(evt: EventItem): number {
    const start = parseInt(evt.hour.split(':')[0],10) + parseInt(evt.hour.split(':')[1],10)/60;
    const end = parseInt(evt.endHour.split(':')[0],10) + parseInt(evt.endHour.split(':')[1],10)/60;
    return (end - start) * this.hourHeight - 2;
  }

  isSubmitting: boolean = false; // Ajoute cette variable

addEvent(): void {
  if(!this.canEdit()) return;
  if (!this.newEventTitle.trim() || !this.newEventLevel.trim()) return;

  // Active le texte "Validation..."
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

  if(this.isEditing && this.selectedEvent) {
    newEvent._id = this.selectedEvent._id;
    this.updateEvent(newEvent).finally(() => {
      this.isSubmitting = false;
      this.showPopup = false;
      this.isEditing = false;
    });
  } else {
    this.createEvent(newEvent).finally(() => {
      this.isSubmitting = false;
      this.showPopup = false;
      this.isEditing = false;
    });
  }
}

  weekDayHeaders = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

  currentYM(): string {
    const d = new Date(this.currentYear, this.currentMonth, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
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

  isPast(dateStr: string): boolean {
    const today = new Date();
    const date = new Date(dateStr + 'T00:00:00');
    return date < today;
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

}
