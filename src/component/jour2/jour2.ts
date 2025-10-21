import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-jour2',
  templateUrl: './jour2.html',
  styleUrls: ['./jour2.css'],
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

  currentDate = new Date();
  currentDateStr = this.formatDate(this.currentDate);
  todayLabel = this.currentDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  nextDate = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);
  nextDateStr = this.formatDate(this.nextDate);

  showPopup = false;
  selectedEvent: EventItem | null = null;
  isEditing = false;

  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = this.currentDateStr;
  newEventHour = '09:00';
  newEventEndHour = '10:00';
  newEventDuration = 1;
  newEventDescription = '';

  userTeam: string = '';
  userRole = '';
  private apiUrl = 'http://localhost:3000/api/events';

  ngOnInit(): void {
    this.loadEvents();
    this.userRole = this.authService.getUserRole();
    this.loadUserFromLocalStorage();
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
    return ['coach', 'admin', 'super admin'].includes(this.userRole);
  }

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

  getEventsByDay(day: string | Date): EventItem[] {
    const dayStr = typeof day === 'string' ? day : this.formatDate(day);

    return this.events
      .filter(evt => evt.day === dayStr)
      .filter(evt => {
        switch(this.userRole.toLowerCase()) {
          case 'joueur':
            return ['Tous', 'Joueur', this.userTeam].includes(evt.level);
          case 'coach':
            return ['Tous','Coach','U7','U9','U11','U13','U15','U18','U23','SeniorA','SeniorB','SeniorD'].includes(evt.level);
          case 'invit':
          case 'invité':
            return ['Tous','Invité'].includes(evt.level);
          case 'admin':
          case 'super admin':
            return true;
          default:
            return false;
        }
      })
      .sort((a,b) => {
        const aMinutes = parseInt(a.hour.split(':')[0])*60 + parseInt(a.hour.split(':')[1]);
        const bMinutes = parseInt(b.hour.split(':')[0])*60 + parseInt(b.hour.split(':')[1]);
        return aMinutes - bMinutes;
      });
  }

  getEventIcon(evt: EventItem): string {
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
