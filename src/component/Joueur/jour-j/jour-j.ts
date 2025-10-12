import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../../../services/userService/Auth.Service';

// Interface d'un événement
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
  color?: string;
}

type ViewMode = 'month' | 'week';

@Component({
  selector: 'app-jour-j',
  templateUrl: './jour-j.html',
  styleUrls: ['./jour-j.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class JourJ implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // ----- Variables du calendrier -----
  hours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
  eventTypes = ['Match', 'Entraînement', 'Stage', 'Tournoi', 'Fête', 'Réunion'];
  categories = [
    'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U23',
    'SeniorA','SeniorB','SeniorC','SeniorD'
  ];

  events: EventItem[] = [];
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  currentWeekStart = this.getMonday(this.today);
  viewMode: ViewMode = 'month';
  monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  monthDays: string[] = [];
  weekDays: string[] = [];

  // ----- Popup -----
  showPopup = false;
  popupEvent: EventItem | null = null;
  isLoading = false;
  showSuccessMessage = false;
  successMessage = '';

  // ----- Formulaire création -----
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = '';
  newEventHour = '';
  newEventEndHour = '';
  newEventDuration = 1;

  // ----- Filtres -----
  selectedCategory = '';
  selectedCoach = '';
  searchTerm = '';

  // ----- Permissions -----
  userRole: string = '';  
  private apiUrl = 'http://localhost:3000/api/events';

  ngOnInit(): void {
    this.updateDays();
    this.loadEvents();

    // ---- Récupération du rôle utilisateur pour les permissions ----
    this.userRole = this.authService.getUserRole(); // <-- utilise la méthode propre
    console.log('Rôle utilisateur connecté :', this.userRole);
  }

  // ---- Méthode utilitaire pour vérifier si l'utilisateur peut modifier/supprimer ----
  canEdit(): boolean {
    const role = this.authService.getUserRole();
    console.log('Role actuel:', role);
    return ['coach','admin','super admin'].includes(role);
  }
  
  

  // ----------------- CALENDRIER -----------------
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

  daysInMonth(): number { return new Date(this.currentYear, this.currentMonth + 1, 0).getDate(); }
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

  formatDate(d: Date): string { 
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
  }

  isToday(day: string): boolean { return day === this.formatDate(new Date()); }
  dayName(day: string): string { 
    const names = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']; 
    return day ? names[new Date(day + 'T00:00:00').getDay()] : '';
  }
  dayNum(day: string): number { return day ? parseInt(day.split('-')[2], 10) : 0; }

  // ----------------- EVENTS -----------------
  async loadEvents(): Promise<void> {
    this.isLoading = true;
    try { 
      this.events = await lastValueFrom(this.http.get<EventItem[]>(this.apiUrl)); 
    } catch (e) { 
      console.error('Erreur chargement événements', e); 
      this.showNotification('Erreur lors du chargement des événements');
    } finally {
      this.isLoading = false;
    }
  }

  async createEvent(evt: EventItem): Promise<void> {
    try { 
      const newEvent = await lastValueFrom(this.http.post<EventItem>(this.apiUrl, evt));
      this.events.push(newEvent);
      this.showNotification('Événement créé avec succès');
    } catch (e) { 
      console.error('Erreur création', e); 
      this.showNotification('Erreur lors de la création');
    }
  }

  async removeEvent(evt: EventItem): Promise<void> {
    if (!evt._id) return;

    if (!this.canEdit()) {
      this.showNotification('Vous n\'avez pas la permission de supprimer cet événement');
      return;
    }

    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${evt._id}`));
      this.events = this.events.filter(e => e._id !== evt._id);
      this.showNotification('Événement supprimé avec succès');
    } catch (e) { 
      console.error('Erreur suppression', e); 
      this.showNotification('Erreur lors de la suppression');
    }
  }

  async deleteEvent(event: EventItem): Promise<void> { 
    await this.removeEvent(event); 
    this.closePopup(); 
  }
  

  getEventsByDay(day: string | Date): EventItem[] {
    const dayStr = typeof day === 'string' ? day : this.formatDate(day);
    let events = this.events.filter(evt => evt.day === dayStr);

    if (this.selectedCategory) events = events.filter(evt => evt.category === this.selectedCategory);
    if (this.selectedCoach) events = events.filter(evt => evt.coach.toLowerCase().includes(this.selectedCoach.toLowerCase()));
    if (this.searchTerm) events = events.filter(evt => evt.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || evt.coach.toLowerCase().includes(this.searchTerm.toLowerCase()));

    return events;
  }

  getEventsByHour(day: string, hour: string): EventItem[] {
    return this.getEventsByDay(day).filter(evt => evt.hour.slice(0,5) === hour);
  }

  getEventCountByDay(day: string): number { return this.getEventsByDay(day).length; }
  getEventHeight(evt: EventItem): string { return `${evt.duration * 60}px`; }

  openPopup(): void {
    this.popupEvent = null;
    const d = this.viewMode === 'week' ? this.currentWeekStart : new Date(this.currentYear, this.currentMonth, 1);
    this.newEventDate = this.formatDate(d);
    this.newEventHour = '09:00';
    this.newEventEndHour = '10:00';
    this.newEventTitle = '';
    this.newEventCoach = '';
    this.newEventCategory = '';
    this.newEventLevel = '';
    this.newEventDuration = 1;
    this.showPopup = true;
  }

  openEventPopup(evt: EventItem): void { this.popupEvent = evt; this.showPopup = true; }
  closePopup(): void { this.showPopup = false; this.popupEvent = null; }

  async addEvent(): Promise<void> {
    if (!this.newEventTitle.trim()) { this.showNotification('Veuillez entrer un titre'); return; }

    const [startH, startM] = this.newEventHour.split(':').map(Number);
    const [endH, endM] = this.newEventEndHour.split(':').map(Number);
    let duration = (endH*60 + endM - (startH*60 + startM)) / 60;
    if (duration <= 0) duration = 1;

    const newEvent: EventItem = {
      day: this.newEventDate,
      hour: this.newEventHour,
      endHour: this.newEventEndHour,
      title: this.newEventTitle.trim(),
      coach: this.newEventCoach.trim(),
      category: this.newEventCategory,
      level: this.newEventLevel,
      duration
    };

    await this.createEvent(newEvent);
    this.closePopup();
  }

  quickAddEvent(day: string | Date, hour: string): void {
    this.openPopup();
    const dayDate = typeof day === 'string' ? day : this.formatDate(day);
    this.newEventDate = dayDate;

    const [h, m] = hour.split(':').map(Number);
    this.newEventHour = hour;
    const endH = h + 1;
    this.newEventEndHour = `${String(endH).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    this.newEventDuration = 1;
  }

  getEventIcon(evt: EventItem): string {
    switch(evt.category) {
      case 'Entraînement': return 'fa-solid fa-futbol';
      case 'Fête': return 'fa-solid fa-champagne-glasses';
      case 'Réunion': return 'fa-solid fa-bullhorn';
      case 'Match': return 'fa-solid fa-trophy';
      case 'Tournoi': return 'fa-solid fa-medal';
      default: return 'fa-solid fa-circle';
    }
  }

  getEventClass(evt: EventItem): string {
    switch(evt.category) {
      case 'Entraînement': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'Fête': return 'bg-gradient-to-r from-pink-500 to-pink-600';
      case 'Réunion': return 'bg-gradient-to-r from-blue-600 to-blue-700';
      case 'Match': return 'bg-gradient-to-r from-yellow-600 to-yellow-700';
      case 'Tournoi': return 'bg-gradient-to-r from-orange-600 to-orange-700';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  }

  showNotification(message: string): void {
    this.successMessage = message;
    this.showSuccessMessage = true;
    setTimeout(() => { this.showSuccessMessage = false; }, 3000);
  }

  clearFilters(): void { this.selectedCategory = ''; this.selectedCoach = ''; this.searchTerm = ''; }

  getUniqueCoaches(): string[] { return [...new Set(this.events.map(evt => evt.coach))].filter(Boolean).sort(); }


  
}
