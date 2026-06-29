import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CommuniquerService } from '../../../../../Backend/Services/communiquer.service';
import { Icon } from '../../icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-add-communiquer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    Icon
  ],
  templateUrl: './add-communiquer.html',
  styleUrl: './add-communiquer.css',
})
export class AddCommuniquer {

  // ==========================================
  // FORMULAIRE
  // ==========================================
  communiquerForm: FormGroup;
  selectedCategories: string[] = [];

  // ==========================================
  // CATÉGORIES
  // ==========================================
  categories = [
    'Tous',
    'U6','U7','U8','U9','U10','U11',
      'U12','U13','U13F','U18','U23',
      'SeniorA','SeniorB','SeniorD',
  ];

  // ==========================================
  // STATES
  // ==========================================
  loading = false;
  successMessage = '';
  errorMessage = '';

  // ==========================================
  // CONSTRUCTOR
  // ==========================================
  constructor(
    private fb: FormBuilder,
    private communiquerService: CommuniquerService,
    public themeService: ThemeService,
  ) {

    console.log('🟢 [AddCommuniquer] Component initialisé');

    this.communiquerForm = this.fb.group({
      titre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(2000)
        ]
      ],
      categories: [
        [],
        Validators.required
      ]
    });

    console.log('📦 Formulaire initialisé :', this.communiquerForm.value);
  }

  // ==========================================
  // GETTERS
  // ==========================================
  get titre() {
    return this.communiquerForm.get('titre');
  }

  get message() {
    return this.communiquerForm.get('message');
  }

  get categoriesSelected() {
    return this.communiquerForm.get('categories');
  }

  // ==========================================
  // RESET MESSAGES
  // ==========================================
  resetMessages(): void {
    console.log('🔄 Reset messages');
    this.successMessage = '';
    this.errorMessage = '';
  }

  // ==========================================
  // CHECKBOX MULTI-SELECTION
  // ==========================================
  isChecked(cat: string): boolean {
    return this.selectedCategories.includes(cat);
  }

  onCategoryChange(event: any, cat: string): void {

    console.group('📌 [Category Change]');

    console.log('Catégorie cliquée :', cat);
    console.log('État checkbox :', event.target.checked);

    // 👉 CAS "TOUS"
    if (cat === 'Tous') {

      if (event.target.checked) {
        this.selectedCategories = [...this.categories];
        console.log('✅ Tous sélectionnés');
      } else {
        this.selectedCategories = [];
        console.log('❌ Tous désélectionnés');
      }

    } else {

      // 👉 AJOUT
      if (event.target.checked) {
        if (!this.selectedCategories.includes(cat)) {
          this.selectedCategories.push(cat);
          console.log('➕ Ajout catégorie :', cat);
        }
      }
      // 👉 SUPPRESSION
      else {
        this.selectedCategories =
          this.selectedCategories.filter(c => c !== cat);

        console.log('➖ Suppression catégorie :', cat);
      }

      // 👉 Si "Tous" était sélectionné mais pas toutes les catégories
      if (this.selectedCategories.length !== this.categories.length) {
        this.selectedCategories =
          this.selectedCategories.filter(c => c !== 'Tous');
      }
    }

    // 🔥 SYNCHRO FORMULAIRE (IMPORTANT)
    this.communiquerForm.patchValue({
      categories: this.selectedCategories
    });

    console.log('📦 SelectedCategories :', this.selectedCategories);
    console.log('📦 Form categories :', this.communiquerForm.value.categories);

    console.groupEnd();
  }

  // ==========================================
  // ENVOI API
  // ==========================================
  envoyerCommuniquer(): void {

    console.group('🚀 [Envoi Communiqué]');

    this.resetMessages();

    if (this.communiquerForm.invalid) {

      console.warn('⚠️ Formulaire invalide :', this.communiquerForm.value);

      this.communiquerForm.markAllAsTouched();

      this.errorMessage =
        'Veuillez remplir correctement tous les champs';

      console.groupEnd();
      return;
    }

    this.loading = true;

    const data = {
      titre: this.communiquerForm.value.titre?.trim(),
      message: this.communiquerForm.value.message?.trim(),
      categories: this.communiquerForm.value.categories || [],
      dateCreation: new Date()
    };

    console.log('📦 Données envoyées :', data);

    this.communiquerService.ajouterCommuniquer(data)
      .subscribe({

        next: (response) => {

          console.log('✅ Réponse API succès :', response);

          this.loading = false;

          this.successMessage =
            '✅ Communiqué envoyé avec succès';

          this.communiquerForm.reset({
            categories: []
          });

          this.selectedCategories = [];

          console.log('♻️ Form reset effectué');

          console.groupEnd();
        },

        error: (error) => {

          console.error('❌ Erreur API :', error);

          this.loading = false;

          this.errorMessage =
            error.error?.message ||
            '❌ Une erreur est survenue';

          console.groupEnd();
        }

      });
  }
}