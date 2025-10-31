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
  ) { }

  // ==================== DONNÉES ====================
  hours = Array.from({ length: 14 }, (_, i) =>
    `${(8 + i).toString().padStart(2, '0')}:00`
  );

  categories = ['Entraînement', 'Match', 'Tournoi', 'Réunion', 'Fête'];
  public = [
    'Admin', 'Coach', 'Joueur', 'Invité', 'Tous',
    'U7', 'U9', 'U11', 'U13', 'U15', 'U18', 'U23', 'SeniorA', 'SeniorB', 'SeniorD'
  ];

  events: EventItem[] = [];
  matches: Match[] = [];
  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  currentWeekStart = this.getMonday(this.today);

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

  // ==================== FORMULAIRE ====================
  newEventTitle = '';
  newEventCoach = '';
  newEventCategory = '';
  newEventLevel = '';
  newEventDate = '';
  newEventHour = '';
  newEventEndHour = '';
  newEventDescription = '';

  showEventPopup: boolean = false;
  showMatchPopup: boolean = false;




  // ==================== UTILISATEUR ====================
  userRole: string = '';
  userLevel: string = '';
  userTeam = '';
  tousPublics: string[] = []; // <-- ajoute cette ligne
  userPublics: string[] = []; // 👈 pour éviter l'erreur TS2339
  tousEvents: EventItem[] = []; // <-- correct type
  readonly hourHeight = 56;

  // ==================== INIT ====================
  async ngOnInit(): Promise<void> {
    this.loadUserFromLocalStorage();
    this.setUserAccess(); // 👈 ajout important ici
    this.updateWeekDays();
    await this.loadData();
  }

  // ==================== ACCÈS UTILISATEUR ====================

  private loadUserFromLocalStorage(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (!userStr) {
      this.userRole = '';
      this.userTeam = '';
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // accepte 'equipe' (FR) ou 'team' (EN)
      this.userTeam = (user.equipe || user.team || '').toString();
      // normalise le rôle en minuscules (ex: 'Joueur' -> 'joueur')
      this.userRole = (user.role || '').toString().toLowerCase();

      // debug utile pour vérifier ce qu'on a bien lu
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
        this.userPublics = [...allPublics]; // voit tout
        this.tousEvents = this.events;       // tous les events
        break;
  
      case 'coach':
        this.userPublics = [
          'Coach',
          'Tous',
          ...allPublics.filter(p => p.startsWith('U') || p.startsWith('Senior'))
        ];
        this.tousEvents = this.events.filter(event =>
          this.userPublics.includes(event.level)
        );
        break;
  
      case 'joueur':
      case 'player':
        this.userPublics = ['Joueur', 'Tous'];
        if (team) this.userPublics.push(team);
        this.tousEvents = this.events.filter(event =>
          this.userPublics.includes(event.level)
        );
        break;
  
      case 'inviter':
      case 'inviter':
        this.userPublics = ['Tous'];
        // ⚠️ strict : ne montrer que les events level = 'Tous'
        this.tousEvents = this.events.filter(event => event.level === 'Tous');
        break;
  
      default:
        this.userPublics = ['Tous'];
        this.tousEvents = this.events.filter(event => event.level === 'Tous');
        break;
    }
  
    console.debug('userPublics =', this.userPublics);
    console.debug('tousEvents =', this.tousEvents);
  }

  
  
  
  

  formSubmitted: boolean = false;

  onSubmit() {
    this.formSubmitted = true;
    // ton code pour gérer l'envoi du formulaire
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

  // ==================== ÉVÉNEMENTS / MATCHS ====================
  getEventsForDay(day: string): EventItem[] {
    const formattedDay = this.formatDate(day);
    let dayEvents = this.events.filter(e => e.day === formattedDay);
  
    const role = (this.userRole || '').toLowerCase();
    const team = (this.userTeam || '').toLowerCase();
  
    dayEvents = dayEvents.filter(e => {
      const level = (e.level || '').toLowerCase();
  
      if (level === 'tous') return true; // Tous voient les "Tous"
  
      if (role === 'admin' || role === 'super admin') return true;
  
      if (role === 'coach') {
        return level === 'tous' || level === 'coach' || level === team || level.startsWith('u') || level.startsWith('senior');
      }
      
  
      if (role === 'joueur') {
        return level === 'joueur' || level === team;
      }
  
      if (role === 'invité') {
        return false; // les autres que "Tous" ne sont pas visibles
      }
  
      return false;
    });
  
    // Tri par heure
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

  canViewEvent(evt: any): boolean {
    const level = (evt.level || '').trim().toUpperCase();
    const userTeam = (this.userTeam || '').trim().toUpperCase();
    const role = (this.userRole || '').trim().toUpperCase();

    // Admin et SuperAdmin voient tout
    if (['ADMIN', 'SUPERADMIN'].includes(role)) return true;

    // Coach voit son équipe et tous
    if (role === 'coach') return level === userTeam || level === 'Tous';

    // Joueur voit son équipe, Joueur et Tous
    if (role === 'joueur') return level === userTeam || level === 'joueur' || level === 'Tous';

    // Invité voit uniquement Tous
    if (role === 'invité') return level === 'TOUS';

    // Public : tout le monde peut voir les événements marqués "Public"
    if (level === 'PUBLIC') return true;

    return false;
  }


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

  formatFullDate(dateStr: string): string {
    const d = new Date(dateStr);
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()}`;
  }

  openPopup(): void {
    if (!this.canEdit()) return;
    this.isEditing = false;
    this.resetForm();
    this.newEventDate = this.formatDate(this.currentWeekStart);
    this.showPopup = true;
  }

  closePopup(): void { this.showPopup = false; this.isEditing = false; }

  editEvent(evt: EventItem): void {
    this.selectedEvent = { ...evt };
    this.isEditing = true;
    this.newEventDate = evt.day;
    this.newEventHour = evt.hour;
    this.newEventEndHour = evt.endHour;
    this.newEventTitle = evt.title;
    this.newEventCoach = evt.coach;
    this.newEventCategory = evt.category;
    this.newEventLevel = evt.level || this.public[0];
    this.newEventDescription = evt.description || '';
    this.showPopup = true;
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
    if (!id || !confirm('Voulez-vous vraiment supprimer cet événement ?')) return;
    try { await lastValueFrom(this.eventService.deleteEvent(id)); this.loadData(); }
    catch (err) { console.error(err); }
  }

  openEventDetails(event: EventItem): void {
    this.selectedEvent = event;
    this.showEventPopup = true; // ✅ popup DÉTAILS
    this.showPopup = false;     // ❌ on ferme la popup création au cas où
    this.isEditing = false;
  }
  
  closeEventDetails(): void {
    this.showEventPopup = false;
    this.selectedEvent = null;
  }
  

  // Dans la classe Jour
  openMatchDetails(match: Match): void {
    this.selectedMatch = match; // stocke le match sélectionné
    this.showMatchPopup = true; // variable pour afficher le popup/modal
  }

  // Dans ton composant Jour
  closeMatchDetails(): void {
    this.showMatchPopup = false; // variable qui contrôle l'affichage du popup de match
    this.selectedMatch = null;   // réinitialise le match sélectionné
  }

  isToday(day: string | Date): boolean {
    const dayDate = typeof day === 'string' ? new Date(day) : day;
    const today = new Date();
  
    // Comparer uniquement le jour, mois et année
    return dayDate.getDate() === today.getDate() &&
           dayDate.getMonth() === today.getMonth() &&
           dayDate.getFullYear() === today.getFullYear();
  }
  
  
  
}
