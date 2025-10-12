import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UtilisateurService, User } from '../../../../../services/userService/utilisateur.service';
import { CreerConvocationsC } from '../../Bouton/creer-convocations-c/creer-convocations-c';
import { CreerMatchC } from '../../Bouton/creer-match-c/creer-match-c';
import { ActusC } from "../../Bouton/creer-post-c/creer-post-c";
import { ListJoueur } from "../list-joueur/list-joueur";

type Toast = { message: string; type: 'success' | 'error' };

@Component({
  selector: 'app-user-c',
  standalone: true,
  imports: [CommonModule, FormsModule, CreerConvocationsC, CreerMatchC, RouterLink, ActusC, ListJoueur],
  templateUrl: './user-c.html',
  styleUrls: ['./user-c.css']
})
export class UserC implements OnInit {
  user: User | null = null;
  loading = true;
  toast: Toast | null = null;

  constructor(private utilisateurService: UtilisateurService, public router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    const session = localStorage.getItem('utilisateur');
    if (session) {
      this.user = JSON.parse(session) as User;
      if (!this.user.initiale) {
        this.user.initiale = (
          (this.user.prenom?.[0] || '') + (this.user.nom?.[0] || '')
        ).toUpperCase();
      }
    } else {
      this.showToast('Aucun utilisateur connecté.', 'error');
      this.router.navigate(['/connexion']);
    }
    this.loading = false;
  }

  editProfile(): void {
    this.showToast('Modification du profil à implémenter.', 'success');
  }

  openMessages(): void {
    this.router.navigate(['/messagesC']).catch(err => console.error('Erreur navigation:', err));
  }

  logout(): void {
    localStorage.removeItem('utilisateur');
    this.showToast('Déconnexion réussie.', 'success');
    this.router.navigate(['/connexion']);
  }

  deleteProfile(): void {
    const confirmed = confirm('⚠️ Supprimer votre compte est irréversible. Continuer ?');
    if (!confirmed) return;

    if (!this.user || !this.user.id) {
      alert('Utilisateur non trouvé.');
      return;
    }

    this.utilisateurService.deleteUser(this.user.id).subscribe({
      next: () => {
        localStorage.removeItem('utilisateur');
        this.showToast('Compte supprimé avec succès.', 'success');
        this.router.navigate(['/connexion']);
      },
      error: (err) => {
        console.error('Erreur suppression compte:', err);
        this.showToast('Erreur lors de la suppression du compte.', 'error');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 4000);
  }
}
