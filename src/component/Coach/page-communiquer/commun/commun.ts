import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommuniqueService, Communique } from '../../../../../services/communique.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-commun',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commun.html',
})
export class Commun implements OnInit {
  communiques: Communique[] = [];
  communiquesFiltres: Communique[] = [];
  filtre: string = '';
  popupOuverte = false;

  // Gestion des images
  imageFile?: File;
  imagePreview: string | ArrayBuffer | null = null;

  nouveauCommunique: any = {
    titre: '',
    contenu: '',
    auteur: '',
    tags: [],
    image: '/assets/LOGO.png',
    visible: true,
    likes: 0,
    date: new Date()
  };

  backendUrl = 'http://localhost:3000'; // URL de ton backend pour accéder aux images uploadées

  // Utilisateur connecté
  userConnecte: any = null;

  constructor(private communiqueService: CommuniqueService) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur depuis localStorage
    const userStr = localStorage.getItem('utilisateur'); // ou 'currentUser' selon ta clé
    if (userStr) {
      this.userConnecte = JSON.parse(userStr);
    }

    this.chargerCommuniques();
  }


  // Vérifie si l'utilisateur peut créer un communiqué
  peutCreer(): boolean {
    if (!this.userConnecte || !this.userConnecte.role) return false;
    const rolesAutorises = ['coach', 'admin', 'super admin'];
    return rolesAutorises.includes(this.userConnecte.role.toLowerCase());
  }

  ouvrirPopup() {
    if (!this.peutCreer()) {
      alert('Vous n’êtes pas autorisé à créer un communiqué.');
      return;
    }
    this.popupOuverte = true;
  }

  fermerPopup() {
    this.popupOuverte = false;
    this.nouveauCommunique = {
      titre: '',
      contenu: '',
      auteur: '',
      tags: [],
      image: '/assets/LOGO.png',
      visible: true,
      likes: 0,
      date: new Date()
    };
    this.imageFile = undefined;
    this.imagePreview = null;
  }

  chargerCommuniques() {
    this.communiqueService.getCommuniques().subscribe({
      next: (data) => {
        this.communiques = data.map(c => ({
          ...c,
          tags: Array.isArray(c.tags) ? c.tags : (c.tags ? [c.tags] : []),
          date: c.date ? new Date(c.date) : new Date(),
          // Construction de l'URL complète de l'image
          image: c.image ? (c.image.startsWith('/uploads') ? `${this.backendUrl}${c.image}` : c.image) : '/assets/LOGO.png'
        }));
        this.appliquerFiltre();
      },
      error: (err) => console.error('Erreur getCommuniques :', err)
    });
  }

  appliquerFiltre() {
    this.communiquesFiltres = this.communiques.filter(c =>
      c.titre.toLowerCase().includes(this.filtre.toLowerCase())
    );
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;

      // Aperçu avant upload
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.nouveauCommunique.image = this.imagePreview; // affichage immédiat dans le formulaire
      };
      reader.readAsDataURL(file);
    }
  }

  ajouterCommunique() {
    if (!this.peutCreer()) {
      alert('Vous n’êtes pas autorisé à créer un communiqué.');
      return;
    }

    // Transformer les tags en tableau si nécessaire
    if (typeof this.nouveauCommunique.tags === 'string') {
      this.nouveauCommunique.tags = this.nouveauCommunique.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t);
    }

    // Ajouter la date
    this.nouveauCommunique.date = new Date();

    // Préparer FormData pour l'envoi au backend
    const formData = new FormData();
    formData.append('titre', this.nouveauCommunique.titre);
    formData.append('contenu', this.nouveauCommunique.contenu);
    formData.append('auteur', this.nouveauCommunique.auteur);
    formData.append('tags', (this.nouveauCommunique.tags || []).join(','));
    if (this.imageFile) {
      formData.append('image', this.imageFile); // fichier uploadé
    }

    this.communiqueService.ajouterCommunique(formData).subscribe({
      next: () => {
        this.chargerCommuniques(); // recharger la liste des communiqués
        this.fermerPopup();         // fermer le formulaire
      },
      error: (err) => console.error('Erreur lors de l’ajout :', err)
    });
  }

  liker(communique: Communique) {
    if (!communique._id) return;
  
    const key = `like_${communique._id}`;
    const dejaLike = localStorage.getItem(key) === 'true';
  
    if (!dejaLike) {
      this.communiqueService.likeCommunique(communique._id).subscribe({
        next: (updated) => {
          communique.likes = updated.likes;
          localStorage.setItem(key, 'true');
        },
        error: (err) => console.error('Erreur like :', err)
      });
    } else {
      this.communiqueService.dislikeCommunique(communique._id).subscribe({
        next: (updated) => {
          communique.likes = updated.likes;
          localStorage.removeItem(key);
        },
        error: (err) => console.error('Erreur dislike :', err)
      });
    }
  }
}
