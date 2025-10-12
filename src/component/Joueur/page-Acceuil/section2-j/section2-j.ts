import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Stat {
  label: string;
  value: number | string;
  icon: string;
}

@Component({
  selector: 'app-section2-j',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './section2-j.html',
  styleUrl: './section2-j.css'
})
export class Section2J implements OnInit {

  // Gestion de la modal
  activeFeatureIndex: number | null = null;
  showFullDescription = false;

  // Liste des fonctionnalités
  features: Feature[] = [
    { 
      title: 'Voir tes convocations', 
      description: "Consulte tes convocations dans l’onglet « Match », puis « Convocations » pour connaître les détails du match. Tu peux aussi y accéder depuis le dashboard via le bouton « Convocation ».",
      icon: 'fa-solid fa-envelope'
    },
    { 
      title: 'Voir le planning', 
      description: "Accède au planning dans l’onglet « Planning » pour découvrir tous les événements du club. Tu peux également le consulter depuis le dashboard avec le bouton « Planning ».",
      icon: 'fa-solid fa-calendar-days'
    },
    { 
      title: 'Suivre les matchs', 
      description: "Retrouve tous les matchs du club dans l’onglet « Match » ou depuis le dashboard via le bouton « Match ».",
      icon: 'fa-solid fa-users'
    },
    { 
      title: 'Discussions privées', 
      description: "Envoie des messages privés à tes joueurs, invités ou coachs. Suis tes conversations et reste connecté avec ton équipe facilement.",
      icon: 'fa-solid fa-comments'
    }    
  ];

  // Stats du club
  stats: Stat[] = [
    { label: 'Membres', value: 450, icon: 'fa-solid fa-users' },
    { label: 'Année de création', value: 1995, icon: 'fa-solid fa-calendar' },
    { label: 'Équipes actives', value: 12, icon: 'fa-solid fa-people-group' },
    { label: 'Catégories (U6,U7,U8..)', value: 8, icon: 'fa-solid fa-layer-group' },
  ];


  currentUser: any = null;

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (e) {
        console.error("Erreur parsing currentUser:", e);
      }
    }
  }

  openFeature(index: number) {
    this.activeFeatureIndex = index;
    this.showFullDescription = false;
  
    // Empêcher le scroll
    document.body.style.overflow = 'hidden';
  }

  closeFeature() {
    this.activeFeatureIndex = null;
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
}
