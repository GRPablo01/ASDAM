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
  selector: 'app-sections2',
  templateUrl: './sections2.html',
  styleUrls: ['./sections2.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class Sections2 implements OnInit {

  // Gestion de la modal
  activeFeatureIndex: number | null = null;
  showFullDescription = false;

  // Liste des fonctionnalités
  features: Feature[] = [
    { 
      title: 'Créer des convocations', 
      description: "Envoyez des convocations aux joueurs rapidement depuis l'onglet Match ou le Dashboard grâce au bouton prévu.",
      icon: 'fa-solid fa-envelope'
    },
    { 
      title: 'Créer et planifier des événements', 
      description: "Créez, planifiez et gérez vos événements internes ou externes depuis l'onglet Planning ou le Dashboard. Vous pouvez également envoyer des rappels automatiques aux joueurs inscrits.",
      icon: 'fa-solid fa-calendar-days'
    },
    { 
      title: 'Créer des matchs', 
      description: "Créez des matchs visibles par tous depuis l'onglet Match ou le Dashboard grâce au bouton. Ajoutez la composition de l’équipe et suivez la présence des joueurs.",
      icon: 'fa-solid fa-users'
    },
    { 
      title: 'Discussion privée', 
      description: "Envoyez des messages privés à vos joueurs, invités ou collègues du staff. Suivez les conversations et restez connecté avec votre équipe en toute simplicité.",
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
  }

  closeFeature() {
    this.activeFeatureIndex = null;
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
}
