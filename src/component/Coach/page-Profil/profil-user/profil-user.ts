import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';
import { CreerConvocationsC } from "../../Bouton/creer-convocations-c/creer-convocations-c";
import { CreerMatchC } from "../../Bouton/creer-match-c/creer-match-c";

type Toast = { message: string; type: 'success' | 'error' };

@Component({
  selector: 'app-profil-user',
  standalone: true,
  imports: [CommonModule, FormsModule, CreerConvocationsC, CreerMatchC,RouterLink],
  templateUrl: './profil-user.html',
  styleUrls: ['./profil-user.css']
})
export class ProfilUser implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';
  toast: Toast | null = null;
  showPopup = false;

  profile = {
    nom: '',
    prenom: '',
    email: ''
  };

  constructor(
    private userService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUtilisateurConnecte();
  }

  loadUtilisateurConnecte() {
    const session = localStorage.getItem('utilisateur');
    if (session) {
      this.user = JSON.parse(session) as User;
  
      // Générer les initiales si nécessaire
      if (!this.user.initiale) {
        this.user.initiale = ((this.user.prenom?.[0] ?? '') + (this.user.nom?.[0] ?? '')).toUpperCase();
      }
  
      // Pré-remplir le formulaire
      this.profile = {
        nom: this.user.nom || '',
        prenom: this.user.prenom || '',
        email: this.user.email || ''
      };
  
      console.log('Utilisateur connecté :', this.user); // Vérifie ici si _id existe
    } else {
      this.error = 'Aucun utilisateur connecté';
      console.log('Aucun utilisateur connecté');
    }
    this.loading = false;
  }
  

  editProfile(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  saveProfile(): void {
    if (!this.profile.nom || !this.profile.prenom || !this.profile.email) {
      this.showToast("Veuillez remplir tous les champs.", "error");
      return;
    }

    if (!this.user?.id) {
      this.showToast("Impossible de mettre à jour : utilisateur introuvable.", "error");
      return;
    }

    this.loading = true;

    this.userService.updateUser(this.user.id, this.profile).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.showToast("Profil mis à jour avec succès ✅", "success");
        this.closePopup();

        // 🔄 on met aussi à jour le localStorage pour garder la session cohérente
        localStorage.setItem('utilisateur', JSON.stringify(updatedUser));
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour :", err);
        this.showToast("Erreur lors de la sauvegarde du profil ❌", "error");
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openMessages(): void {
    this.showToast('Ouverture de la messagerie (à implémenter).', 'success');
  }

  logout(): void {
    localStorage.removeItem('utilisateur');
    this.showToast('Déconnexion effectuée.', 'success');
    this.user = null;
    this.router.navigate(['/connexion']);
  }

  deleteProfile(): void {
    if (!this.user?.id) {
      this.showToast("Impossible de supprimer : utilisateur introuvable.", "error");
      return;
    }
  
    const confirmed = confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !"
    );
  
    if (!confirmed) return;
  
    this.loading = true;
  
    this.userService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.showToast("Votre compte a été supprimé définitivement ✅", "success");
        this.user = null;
        localStorage.removeItem('utilisateur');
        this.router.navigate(['/connexion']);
      },
      error: (err) => {
        console.error("Erreur lors de la suppression :", err);
        this.showToast("Erreur lors de la suppression du compte ❌", "error");
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  

  private showToast(message: string, type: 'success' | 'error') {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3000);
  }
}
