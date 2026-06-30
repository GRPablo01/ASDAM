import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatchService } from '../../../../../Backend/Services/match.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-match',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './add-match.html',
  styleUrl: './add-match.css',
})
export class AddMatch {

  matchForm!: FormGroup;

  loading = false;

  showNotification = false;
  notificationMessage = '';

  successMessage = '';
  errorMessage = '';

  // ==========================================
  // LISTES
  // ==========================================

  categories = [
    'U6',
    'U7',
    'U8',
    'U9',
    'U10',
    'U11',
    'U12',
    'U13',
    'U14',
    'U15',
    'U16',
    'U17',
    'U18',
    'U23',
    'Senior A',
    'Senior B',
    'Senior D',
  ];

  typesMatch = [
    'Championnat',
    'Tournoi',
    'Amical',
    'Coupe'
  ];

  constructor(
    private fb: FormBuilder,
    private matchService: MatchService,
    public themeService: ThemeService,
  ) {

    this.matchForm = this.fb.group({

      equipeDomicile: [
        '',
        Validators.required
      ],

      equipeExterieur: [
        '',
        Validators.required
      ],

      typeMatch: [
        'Amical',
        Validators.required
      ],

      categorie: [
        'Senior A',
        Validators.required
      ],

      dateMatch: [
        '',
        Validators.required
      ],

      heureMatch: [
        '',
        Validators.required
      ],

      stade: [
        '',
        Validators.required
      ]

    });

  }

  showToast(message: string): void {

    this.notificationMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);

  }

  closeNotification(): void {
    this.showNotification = false;
  }

  // ==========================================
  // CREATE MATCH
  // ==========================================

  createMatch(): void {

    // ==========================================
    // RESET MESSAGES
    // ==========================================

    this.successMessage = '';
    this.errorMessage = '';

    // ==========================================
    // VALIDATION FORMULAIRE
    // ==========================================

    if (this.matchForm.invalid) {

      console.error(
        '❌ Formulaire invalide :',
        this.matchForm.value
      );

      this.showToast(
        'Veuillez remplir tous les champs'
      );

      this.matchForm.markAllAsTouched();

      return;

    }

    const formData = this.matchForm.value;

    // ==========================================
    // SECURITE EQUIPES
    // ==========================================

    if (
      formData.equipeDomicile
        ?.trim()
        .toLowerCase() ===
      formData.equipeExterieur
        ?.trim()
        .toLowerCase()
    ) {

      console.error(
        '❌ Les équipes sont identiques'
      );

      this.errorMessage =
        'Les équipes doivent être différentes';

      this.showToast(
        'Les équipes doivent être différentes'
      );

      return;

    }

    // ==========================================
    // LOADING
    // ==========================================

    this.loading = true;

    console.log(
      '📤 Envoi du match :',
      formData
    );

    // ==========================================
    // API CREATE MATCH
    // ==========================================

    this.matchService.createMatch(formData)
      .subscribe({

        // ======================================
        // SUCCESS
        // ======================================

        next: (response) => {

          console.log(
            '✅ Match créé :',
            response
          );

          this.loading = false;

          this.successMessage =
            'Match créé avec succès';

          // ✅ TOAST SUCCESS
          this.showToast(
            'Match créé avec succès'
          );

          // ====================================
          // RESET FORM
          // ====================================

          this.matchForm.reset({

            typeMatch: 'Amical',
            categorie: 'Senior A'

          });

        },

        // ======================================
        // ERROR
        // ======================================

        error: (error) => {

          console.error(
            '❌ Erreur création match :',
            error
          );

          this.loading = false;

          this.errorMessage =
            error?.error?.message ||
            'Erreur lors de la création du match';

          // ❌ TOAST ERROR
          this.showToast(
            this.errorMessage
          );

        }

      });

  }

}
