import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-param-c',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './param-c.html',
  styleUrls: ['./param-c.css']
})
export class ParamC {
  // Exemple de variables pour le formulaire
  nom: string = '';
  prenom: string = '';
  email: string = '';
  ancienMdp: string = '';
  nouveauMdp: string = '';
  notifications: boolean = true;

  // Fonctions de sauvegarde
  sauvegarderProfil() {
    console.log('Profil sauvegardé:', this.nom, this.prenom, this.email);
    alert('Profil sauvegardé !');
  }

  changerMotDePasse() {
    console.log('Mot de passe changé');
    alert('Mot de passe modifié !');
  }

  toggleNotifications() {
    console.log('Notifications:', this.notifications);
  }
}
