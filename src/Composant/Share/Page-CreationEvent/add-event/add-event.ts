import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';

import { EventService } from '../../../../../Backend/Services/event.Service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './add-event.html',
  styleUrl: './add-event.css',
})
export class AddEvent {

  // ======================================================
  // FORM
  // ======================================================

  titre = '';
  description = '';
  date = '';
  lieu = '';
  heureDebut = '';
  heureFin = '';

  // ======================================================
  // UI
  // ======================================================

  successMessage = '';
  errorMessage = '';

  showNotification = false;
  notificationMessage = '';

  loading = false;

  constructor(
    private eventService: EventService,
    public themeService: ThemeService,
    private router: Router
  ) {
    console.log('🚀 AddEvent initialized');
  }

  // ======================================================
  // CREATE EVENT
  // ======================================================

  createEvent() {

    console.log('🟡 CREATE EVENT START');

    this.errorMessage = '';
    this.successMessage = '';

    // =========================================
    // VALIDATION
    // =========================================

    if (
      !this.titre.trim() ||
      !this.description.trim() ||
      !this.date ||
      !this.lieu.trim() ||
      !this.heureDebut ||
      !this.heureFin
    ) {

      this.errorMessage =
        'Tous les champs sont obligatoires';

      return;
    }

    // =========================================
    // VALIDATION HOURS
    // =========================================

    if (this.heureDebut >= this.heureFin) {

      this.errorMessage =
        "L'heure de début doit être inférieure à l'heure de fin";

      return;
    }

    // =========================================
    // PAYLOAD
    // =========================================

    const data = {

      titre: this.titre,
      description: this.description,
      date: this.date,
      lieu: this.lieu,
      heureDebut: this.heureDebut,
      heureFin: this.heureFin,
    };

    console.log('📦 DATA:', data);

    this.loading = true;

    // =========================================
    // API
    // =========================================

    this.eventService.createEvent(data)
      .subscribe({

        next: (res) => {

          console.log('✅ EVENT CREATED:', res);

          this.loading = false;

          this.successMessage =
            'Événement créé avec succès';

          this.showToast(
            'Événement publié avec succès !'
          );

          this.resetForm();

          // ===================================
          // REDIRECT
          // ===================================

          setTimeout(() => {

            this.router.navigate(['/dashboard']);

          }, 1200);
        },

        error: (err) => {

          console.error(
            '❌ CREATE EVENT ERROR:',
            err
          );

          this.loading = false;

          this.errorMessage =
            err?.error?.message ||
            'Erreur lors de la création';
        }
      });

    console.log('🟡 CREATE EVENT END');
  }

  // ======================================================
  // RESET
  // ======================================================

  resetForm() {

    console.log('🔄 RESET FORM');

    this.titre = '';
    this.description = '';
    this.date = '';
    this.lieu = '';
    this.heureDebut = '';
    this.heureFin = '';
  }

  // ======================================================
  // BACK
  // ======================================================

  goBack(): void {

    this.router.navigate(['/dashboard']);
  }

  // ======================================================
  // TOAST
  // ======================================================

  showToast(message: string) {

    this.notificationMessage = message;

    this.showNotification = true;

    setTimeout(() => {

      this.showNotification = false;

    }, 3000);
  }

  closeNotification() {

    this.showNotification = false;
  }
}