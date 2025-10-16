import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommuniqueService, Communique } from '../../../../../services/communique.service';

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
  isLoaded = false;

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
    date: new Date(),
  };

  backendUrl = 'http://localhost:3000';
  userConnecte: any = null;

  animatingLike: string | null = null;

  constructor(private communiqueService: CommuniqueService) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) this.userConnecte = JSON.parse(userStr);

    this.chargerCommuniques();
  }

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
      date: new Date(),
    };
    this.imageFile = undefined;
    this.imagePreview = null;
  }

  chargerCommuniques() {
    this.communiqueService.getCommuniques().subscribe({
      next: (data) => {
        this.communiques = data.map((c) => ({
          ...c,
          tags: Array.isArray(c.tags) ? c.tags : c.tags ? [c.tags] : [],
          date: c.date ? new Date(c.date) : new Date(),
          image: c.image?.startsWith('/uploads')
            ? `${this.backendUrl}${c.image}`
            : c.image || '/assets/LOGO.png',
          liked: false, // initialisation liked
        }));
        this.appliquerFiltre();
        this.isLoaded = true; // tout est chargé, afficher le contenu
      },
      error: (err) => console.error('Erreur getCommuniques :', err),
    });
  }

  appliquerFiltre() {
    this.communiquesFiltres = this.communiques.filter((c) =>
      c.titre.toLowerCase().includes(this.filtre.toLowerCase())
    );
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.nouveauCommunique.image = this.imagePreview;
      };
      reader.readAsDataURL(file);
    }
  }

  ajouterCommunique() {
    if (!this.peutCreer()) {
      alert('Vous n’êtes pas autorisé à créer un communiqué.');
      return;
    }

    if (typeof this.nouveauCommunique.tags === 'string') {
      this.nouveauCommunique.tags = this.nouveauCommunique.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t);
    }

    this.nouveauCommunique.date = new Date();
    const formData = new FormData();
    formData.append('titre', this.nouveauCommunique.titre);
    formData.append('contenu', this.nouveauCommunique.contenu);
    formData.append('auteur', this.nouveauCommunique.auteur);
    formData.append('tags', (this.nouveauCommunique.tags || []).join(','));
    if (this.imageFile) formData.append('image', this.imageFile);

    this.communiqueService.ajouterCommunique(formData).subscribe({
      next: () => {
        this.chargerCommuniques();
        this.fermerPopup();
      },
      error: (err) => console.error('Erreur ajout communiqué :', err),
    });
  }

  toggleLike(communique: Communique) {
    if (!communique._id) return;
    const key = `like_${communique._id}`;
    const dejaLike = localStorage.getItem(key) === 'true';

    if (!dejaLike) {
      this.communiqueService.likeCommunique(communique._id).subscribe({
        next: (updated) => {
          communique.likes = updated.likes;
          communique.liked = true;
          this.animatingLike = communique._id!;
          setTimeout(() => (this.animatingLike = null), 800);
          localStorage.setItem(key, 'true');
        },
        error: (err) => console.error(err),
      });
    } else {
      this.communiqueService.dislikeCommunique(communique._id).subscribe({
        next: (updated) => {
          communique.likes = updated.likes;
          communique.liked = false;
          localStorage.removeItem(key);
        },
        error: (err) => console.error(err),
      });
    }
  }

  supprimerCommunique(id: string | undefined, index: number) {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer ce communiqué ?')) return;

    this.communiqueService.supprimerCommunique(id).subscribe({
      next: () => {
        this.communiques.splice(index, 1);
        this.appliquerFiltre();
      },
      error: (err) => console.error('Erreur suppression communiqué :', err),
    });
  }
}
