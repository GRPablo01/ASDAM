import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventService, Evenement } from '../../../../../Backend/Services/event.Service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule,Icon],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class Event implements OnInit {

  // ======================================================
  // 📦 EVENTS
  // ======================================================

  events: Evenement[] = [];

  // ======================================================
  // ⏳ LOADING
  // ======================================================

  isLoading = false;

  // ======================================================
  // ❌ ERROR
  // ======================================================

  errorMessage = '';

  constructor(private eventService: EventService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  // ======================================================
  // 🚀 INIT
  // ======================================================

  ngOnInit(): void {
    this.loadEvents();
  }

  // ======================================================
  // 📥 LOAD EVENTS
  // ======================================================

  loadEvents(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getEvents().subscribe({

      next: (data) => {

        console.log('✅ EVENTS :', data);

        this.events = data;
        this.isLoading = false;
      },

      error: (error) => {

        console.error('❌ ERREUR EVENTS :', error);

        this.errorMessage = 'Impossible de récupérer les événements';
        this.isLoading = false;
      }
    });
  }

  // ======================================================
  // 🗑️ DELETE EVENT
  // ======================================================
  supprimerEvent(event: any): void {

    console.log('🗑️ Supprimer événement :', event);

    const eventId = event?._id || event?.id;

    if (!eventId) {

      console.error('❌ ID événement introuvable', event);
      return;
    }

    this.goToDeleteEvent(eventId);
  }

  // ======================================================
  // 🚀 GO TO DELETE EVENT
  // ======================================================
  goToDeleteEvent(eventId: string): void {
    this.router.navigate(['/delete-event', eventId]);
  }

  // ======================================================
// ✏️ MODIFY EVENT
// ======================================================
modifierEvent(event: any): void {

  console.log('✏️ Modifier événement :', event);

  const eventId = event?._id || event?.id;

  if (!eventId) {

    console.error('❌ ID événement introuvable', event);
    return;
  }

  this.goToModifyEvent(eventId);
}

// ======================================================
// 🚀 GO TO MODIFY EVENT
// ======================================================
goToModifyEvent(eventId: string): void {
  this.router.navigate(['/modify-event', eventId]);
}
}