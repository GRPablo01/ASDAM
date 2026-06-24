import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActusService } from '../../../../../Backend/Services/actus.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-actus',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './add-actus.html',
  styleUrl: './add-actus.css',
})
export class AddActus {

  // =========================
  // BACKEND FIELDS ONLY
  // =========================
  titre = '';
  description = '';
  auteur = '';
  categorie = 'general';

  // =========================
  // IMAGE
  // =========================
  imageFile: File | null = null;
  // ❌ supprimé dans la version clean
  mode: 'url' | 'file' = 'url';
  // ❌ supprimé
imageUrl = '';

  // =========================
  // UI
  // =========================
  successMessage = '';
  errorMessage = '';

  showNotification = false;
  notificationMessage = '';

  constructor(
    private actusService: ActusService,
    public themeService: ThemeService,
    private router: Router
  ) {
    console.log('🚀 AddActus clean component initialized');
  }

  // ======================================================
  // CREATE ACTUS
  // ======================================================
  createActus() {
    console.log('🟡 CREATE ACTUS START');

    console.log('📦 Data:', {
      titre: this.titre,
      description: this.description,
      categorie: this.categorie,
      auteur: this.auteur,
    });

    // VALIDATION SIMPLE
    if (!this.titre.trim() || !this.description.trim()) {
      this.errorMessage = 'Titre et description obligatoires';
      return;
    }

    const formData = new FormData();

    // TEXT FIELDS
    formData.append('titre', this.titre);
    formData.append('description', this.description);
    formData.append('categorie', this.categorie);
    formData.append('auteur', this.auteur || 'admin');

    // IMAGE (OPTIONNEL)
    if (this.imageFile) {
      formData.append('image', this.imageFile);
      console.log('🖼️ Image file added');
    }

    console.log('🚀 Sending request to API...');

    this.actusService.createActus(formData).subscribe({
      next: (res) => {
        console.log('✅ SUCCESS:', res);

        this.successMessage = 'Actualité créée avec succès';
        this.errorMessage = '';

        this.resetForm();
        this.showToast('Actualité publiée avec succès !');

        // 👉 REDIRECTION APRÈS SUCCÈS
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1200);
      },

      error: (err) => {
        console.error('❌ ERROR:', err);
        this.errorMessage = 'Erreur lors de la création';
      }
    });

    console.log('🟡 CREATE ACTUS END');
  }

  // ======================================================
  // FILE HANDLER
  // ======================================================
  onFileSelected(event: any) {
    const file = event.target.files?.[0];

    if (!file) return;

    this.imageFile = file;

    console.log('📁 Image selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });
  }

  // ======================================================
  // RESET FORM
  // ======================================================
  resetForm() {
    console.log('🔄 Reset form');

    this.titre = '';
    this.description = '';
    this.auteur = '';
    this.categorie = 'general';
    this.imageFile = null;
  }

  // ======================================================
  // 🔙 BACK
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