import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../../services/userService/Auth.Service';

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

@Component({
  selector: 'app-jour',
  templateUrl: './jour.html',
  styleUrls: ['./jour.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class Jour implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}

  categories = ['Entraînement', 'Match', 'Tournoi', 'Réunion', 'Fête'];
  levels = [
    'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','U23',
    'SeniorA','SeniorB','SeniorC','SeniorD'
  ];
  events: EventItem[] = [];

  // Jour actuel
  currentDate = new Date();
  currentDateStr = this.formatDate(this.currentDate);
  todayLabel = this.currentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Popup / État
  showPopup = false;
  selectedEvent: EventItem | null = null;
  isEditing = false;

  // Formulaire
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = this.currentDateStr;
  newEventHour = '09:00';
  newEventEndHour = '10:00';
  newEventDuration = 1;
  newEventDescription = '';

  userRole = '';
  private apiUrl = 'http://localhost:3000/api/events';

  ngOnInit(): void {
    this.loadEvents();
    this.userRole = this.authService.getUserRole();
  }

  canEdit(): boolean {
    return ['coach', 'admin', 'super admin'].includes(this.userRole);
  }

  // ===== BACKEND =====
  async loadEvents(): Promise<void> {
    try {
      this.events = await lastValueFrom(this.http.get<EventItem[]>(this.apiUrl));
    } catch (e) {
      console.error(e);
    }
  }

  async createEvent(evt: EventItem): Promise<void> {
    try {
      const newEvent = await lastValueFrom(this.http.post<EventItem>(this.apiUrl, evt));
      this.events.push(newEvent);
    } catch (e) {
      console.error(e);
    }
  }

  async removeEvent(evt: EventItem): Promise<void> {
    if (!evt._id) return;
    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${evt._id}`));
      this.events = this.events.filter((e) => e._id !== evt._id);
    } catch (e) {
      console.error(e);
    }
  }

  // ===== ACTIONS =====
  addEvent(): void {
    if (!this.newEventTitle.trim()) return;

    const newEvent: EventItem = {
      day: this.newEventDate,
      hour: this.newEventHour,
      endHour: this.newEventEndHour,
      title: this.newEventTitle.trim(),
      coach: this.newEventCoach.trim(),
      category: this.newEventCategory,
      level: this.newEventLevel.trim(),
      duration: this.newEventDuration,
      description: this.newEventDescription,
    };

    this.createEvent(newEvent);
    this.showPopup = false;
  }

  deleteEvent(event: EventItem): void {
    this.removeEvent(event);
    this.closeEventDetails();
  }

  openPopup(): void {
    this.isEditing = false;
    this.showPopup = true;
  }

  openEventDetails(evt: EventItem): void {
    this.selectedEvent = evt;
  }

  closeEventDetails(): void {
    this.selectedEvent = null;
  }

  // ===== HELPERS =====
  formatDate(d: Date | string): string {
    const date = typeof d === 'string' ? new Date(d) : d;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  dayName(day: string): string {
    const names = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return names[new Date(day + 'T00:00:00').getDay()];
  }

  dayNum(day: string): number {
    return parseInt(day.split('-')[2], 10);
  }

  getEventsByDay(day: string): EventItem[] {
    return this.events
      .filter((evt) => evt.day === day)
      .sort(
        (a, b) =>
          parseInt(a.hour.replace(':', ''), 10) - parseInt(b.hour.replace(':', ''), 10)
      );
  }
  getEventIcon(evt: EventItem) {
    switch(evt.category) {
      case 'Entraînement': return 'fa-solid fa-dumbbell';
      case 'Match': return 'fa-solid fa-futbol';
      case 'Tournoi': return 'fa-solid fa-trophy';
      case 'Réunion': return 'fa-solid fa-calendar';
      case 'Fête': return 'fa-solid fa-glass-cheers'; // icône existante Font Awesome
      default: return 'fa-solid fa-circle';
    }
  }

  getEventColor(evt: EventItem): string {
    switch(evt.category) {
      case 'Entraînement': return 'bg-blue-800';   // bleu
      case 'Match': return 'bg-red-800';          // rouge
      case 'Tournoi': return 'bg-yellow-800';     // jaune
      case 'Réunion': return 'bg-purple-800';     // violet
      case 'Fête': return 'bg-green-800';         // vert
      default: return 'bg-gray-400';              // gris par défaut
    }
  }

}
