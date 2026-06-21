import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import { EventService } from '../../../../Backend/Services/event.Service';
import { Icon } from '../../../Composant/Share/icon/icon';

@Component({
  selector: 'app-supriper-event',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './supriper-event.html',
  styleUrl: './supriper-event.css',
})
export class SupriperEvent implements OnInit {

  event: any = {
    _id: '',
    titre: '',
    description: '',
    date: '',
    lieu: '',
    heureDebut: '',
    heureFin: '',
  };

  loading: boolean = false;
  eventId: string = '';

  // ======================================================
  // 🔔 NOTIFICATION TOAST
  // ======================================================

  showNotification: boolean = false;
  notificationMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {

    this.eventId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.eventId) return;

    this.loadEvent();
  }

  // ======================================================
  // 📦 LOAD EVENT
  // ======================================================

  loadEvent(): void {

    this.loading = true;

    this.eventService.getEvents().subscribe({

      next: (res: any) => {

        const events = res?.events || res;

        const found = events.find(
          (e: any) => (e._id || e.id) === this.eventId
        );

        if (found) {
          this.event = found;
        }

        this.loading = false;
      },

      error: (err) => {

        console.error('❌ Erreur chargement event:', err);

        this.loading = false;
      }
    });
  }

  // ======================================================
  // 🔔 TOAST
  // ======================================================

  openDeleteNotification() {

    this.showNotification = true;

    this.notificationMessage =
      `Suppression en cours pour ${this.event.titre}`;
  }

  closeNotification() {

    this.showNotification = false;
  }

  // ======================================================
  // 🗑️ DELETE EVENT
  // ======================================================

  deleteEvent(): void {

    console.log('===================================');
    console.log('🗑️ DELETE EVENT');
    console.log('===================================');

    // CHECK ID
    if (!this.eventId) {

      console.error('❌ ID événement manquant');

      this.notificationMessage = 'ID événement introuvable';
      this.showNotification = true;

      return;
    }

    this.eventService.deleteEvent(this.eventId).subscribe({

      next: () => {

        console.log('✅ Événement supprimé');

        this.notificationMessage =
          'Événement supprimé avec succès';

        this.showNotification = true;

        setTimeout(() => {

          this.router.navigate(['/event']);

        }, 1200);
      },

      error: (err) => {

        console.error('❌ Erreur suppression événement:', err);

        this.notificationMessage =
          'Erreur lors de la suppression';

        this.showNotification = true;
      }
    });
  }

  // ======================================================
  // 🔙 BACK
  // ======================================================

  goBack(): void {

    this.router.navigate(['/event']);
  }
}