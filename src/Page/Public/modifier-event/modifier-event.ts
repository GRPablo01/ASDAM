import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import {
  EventService,
  Evenement
} from '../../../../Backend/Services/event.Service';

import { Icon } from '../../../Composant/Share/icon/icon';

@Component({
  selector: 'app-modifier-event',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './modifier-event.html',
  styleUrl: './modifier-event.css',
})
export class ModifierEvent implements OnInit {

  // ======================================================
  // 📦 EVENT
  // ======================================================

  event: Evenement = {
    _id: '',
    titre: '',
    description: '',
    date: '',
    lieu: '',
    heureDebut: '',
    heureFin: '',
    image: '',
    categorie: '',
    status: ''
  };

  // ======================================================
  // 📦 ALL EVENTS
  // ======================================================

  allEvents: Evenement[] = [];

  // ======================================================
  // ⚡ STATES
  // ======================================================

  loading: boolean = false;

  eventId: string = '';

  showNotification = false;
  notificationMessage = '';

  // ======================================================
  // 🚀 CONSTRUCTOR
  // ======================================================

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService,
    private eventService: EventService
  ) { }

  // ======================================================
  // 🔥 INIT
  // ======================================================

  ngOnInit(): void {

    // ======================================================
    // 🆔 GET ID FROM URL
    // ======================================================

    this.eventId =
      this.route.snapshot.paramMap.get('id') || '';

    console.log('🆔 EVENT ID :', this.eventId);

    if (!this.eventId) {

      console.error('❌ Aucun ID événement');

      this.notificationMessage =
        'ID événement introuvable';

      this.showNotification = true;

      return;
    }

    // ======================================================
    // 🔥 GET ALL EVENTS
    // ======================================================

    this.getAllEvents();
  }

  // ======================================================
  // 📥 GET ALL EVENTS
  // ======================================================

  getAllEvents(): void {

    console.log('📥 Chargement des événements...');

    this.loading = true;

    this.eventService.getEvents().subscribe({

      next: (events: Evenement[]) => {

        console.log('✅ Events récupérés :', events);

        this.allEvents = events;

        // ======================================================
        // 🔥 FIND EVENT WITH ID
        // ======================================================

        const foundEvent = this.allEvents.find(
          (event) => event._id === this.eventId
        );

        if (!foundEvent) {

          console.error('❌ Événement introuvable');

          this.notificationMessage =
            'Événement introuvable';

          this.showNotification = true;

          this.loading = false;

          return;
        }

        // ======================================================
        // ✅ SET EVENT
        // ======================================================

        this.event = {
          ...foundEvent
        };

        console.log('🎯 Event trouvé :', this.event);

        this.loading = false;
      },

      error: (error) => {

        console.error(
          '❌ Erreur récupération événements :',
          error
        );

        this.loading = false;

        this.notificationMessage =
          'Erreur lors du chargement des événements';

        this.showNotification = true;
      }
    });
  }

  // ======================================================
  // 🔥 UPDATE EVENT
  // ======================================================

  updateEvent(): void {

    console.log('===================================');
    console.log('🔥 UPDATE EVENT');
    console.log('===================================');

    if (!this.eventId) {

      console.error('❌ ID événement manquant');

      this.notificationMessage =
        'ID événement introuvable';

      this.showNotification = true;

      return;
    }

    // ======================================================
    // ✅ VALIDATION
    // ======================================================

    if (
      !this.event.titre ||
      !this.event.description ||
      !this.event.date ||
      !this.event.lieu
    ) {

      console.error('❌ Champs manquants');

      this.notificationMessage =
        'Veuillez remplir tous les champs';

      this.showNotification = true;

      setTimeout(() => {
        this.showNotification = false;
      }, 3000);

      return;
    }

    // ======================================================
    // 🚀 LOADING
    // ======================================================

    this.loading = true;

    console.log('📤 Event envoyé :', this.event);

    // ======================================================
    // 🔥 API UPDATE
    // ======================================================

    this.eventService
      .updateEvent(this.eventId, this.event)
      .subscribe({

        next: (updatedEvent) => {

          console.log(
            '✅ Event modifié :',
            updatedEvent
          );

          this.loading = false;

          this.notificationMessage =
            'Événement modifié avec succès';

          this.showNotification = true;

          setTimeout(() => {

            this.showNotification = false;

            this.router.navigate(['/event']);

          }, 2000);
        },

        error: (error) => {

          console.error(
            '❌ Erreur modification :',
            error
          );

          this.loading = false;

          this.notificationMessage =
            'Erreur lors de la modification';

          this.showNotification = true;

          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
        }
      });
  }

  // ======================================================
  // 🔙 BACK
  // ======================================================

  goBack(): void {

    console.log('🔙 Retour événements');

    this.router.navigate(['/event']);
  }

  // ======================================================
  // ❌ CLOSE NOTIFICATION
  // ======================================================

  closeNotification(): void {

    this.showNotification = false;
  }

}