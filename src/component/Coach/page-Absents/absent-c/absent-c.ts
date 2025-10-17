import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CategorieService, Categorie } from '../../../../../services/categorie.service';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';

type Toast = { message: string; type: 'success' | 'error' };

@Component({
  selector: 'app-absent-c',
  templateUrl: './absent-c.html',
  styleUrls: ['./absent-c.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class AbsentC implements OnInit, OnDestroy {
  categories: Categorie[] = [];
  filteredCategories: Categorie[] = [];
  categoriesWithJoueurs: { categorie: Categorie; joueurs: User[] }[] = [];

  joueurs: User[] = [];
  currentUserEquipe: string | null = null;
  toast: Toast | null = null;
  saveInterval: any;

  constructor(
    private categorieService: CategorieService,
    private utilisateurService: UtilisateurService
  ) {
    console.log('🔹 AbsentC component construit');
  }

  ngOnInit() {
    console.log('🔹 ngOnInit appelé');
    this.getCurrentUser();

    // 🔹 Sauvegarde automatique toutes les 3 secondes
    this.saveInterval = setInterval(() => {
      this.saveJoueursInCategories();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.saveInterval) clearInterval(this.saveInterval);
  }

  // ======================
  // 🔹 Récupérer le coach connecté
  // ======================
  getCurrentUser() {
    this.utilisateurService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserEquipe = user.equipe || 'U23';
        console.log('✅ Coach connecté :', user);
        console.log('✅ Équipe du coach :', this.currentUserEquipe);

        this.loadCategories();
        this.loadJoueurs();
      } else {
        console.warn('⚠️ Aucun utilisateur connecté trouvé');
      }
    });
  }

  // ======================
  // 🔹 Charger toutes les catégories
  // ======================
  loadCategories() {
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('✅ Catégories récupérées :', this.categories);
        this.filterCategoriesByEquipe();
        if (this.joueurs.length) this.assignJoueursToCategories();
      },
      error: (err) => {
        console.error('❌ Erreur chargement catégories', err);
        this.showToast('Erreur chargement catégories', 'error');
      }
    });
  }

  // ======================
  // 🔹 Filtrer les catégories selon l’équipe du coach
  // ======================
  filterCategoriesByEquipe() {
    if (!this.currentUserEquipe) return;

    this.filteredCategories = this.categories.filter(
      cat => cat.categorie === this.currentUserEquipe
    );

    console.log('🔹 Catégories filtrées :', this.filteredCategories);
  }

  // ======================
  // 🔹 Charger les joueurs de la base
  // ======================
  loadJoueurs() {
    this.utilisateurService.getJoueurs().subscribe({
      next: (data) => {
        console.log('✅ Joueurs récupérés :', data);
        this.joueurs = data.filter(j => j.equipe === this.currentUserEquipe);
        this.assignJoueursToCategories();
      },
      error: (err) => {
        console.error('❌ Erreur récupération joueurs', err);
        this.showToast('Erreur récupération joueurs', 'error');
      }
    });
  }

  // ======================
  // 🔹 Associer joueurs ⇢ catégories
  // ======================
  assignJoueursToCategories() {
    if (!this.filteredCategories.length) {
      console.warn('⚠️ Aucune catégorie pour ce coach');
      return;
    }

    this.categoriesWithJoueurs = this.filteredCategories.map(cat => {
      const joueursAssocies = this.joueurs.filter(j => j.equipe === cat.categorie);
      return { categorie: cat, joueurs: joueursAssocies };
    });

    console.log('✅ Catégories + joueurs :', this.categoriesWithJoueurs);
  }

  // ======================
  // 🔹 Sauvegarde en base toutes les 3s
  // ======================
  saveJoueursInCategories() {
    this.categoriesWithJoueurs.forEach(({ categorie, joueurs }) => {
      if (categorie._id) {
        // 🔹 Préparer le tableau pour la DB avec les champs nécessaires
        const joueursToSave = joueurs.map(j => ({
          nom: j.nom,
          prenom: j.prenom,
          poste: j.poste || '',
          jour: j.jour || ''
        }));

        this.categorieService.updateCategorieJoueurs(categorie._id, joueursToSave).subscribe({
          next: (res) => console.log(`✅ Joueurs enregistrés pour ${categorie.categorie}`),
          error: (err) => console.error(`❌ Erreur enregistrement pour ${categorie.categorie}`, err)
        });
      }
    });
  }

  // ======================
  // 🔹 Toasts de notification
  // ======================
  showToast(message: string, type: 'success' | 'error') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }
}
