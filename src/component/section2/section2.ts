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
  selector: 'app-section2',
  templateUrl: './section2.html',
  styleUrls: ['./section2.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class Sections2 implements OnInit {

  // Gestion de la modal
  activeFeatureIndex: number | null = null;
  showFullDescription = false;

  // Liste complète des fonctionnalités par rôle
  private allFeatures: { [role: string]: Feature[] } = {
    admin: [
      { 
        title: 'Créer des convocations', 
        description: "Envoyez des convocations aux joueurs rapidement depuis l'onglet Dashboard grâce au bouton prévu.",
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
    ],
    coach: [
      { 
        title: 'Créer des convocations', 
        description: "Envoyez des convocations aux joueurs rapidement depuis l'onglet Dashboard grâce au bouton prévu.",
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
    ],
    joueur: [
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
    ],
    inviter: [
      { 
        title: 'Voir les actualités', 
        description: "Consulte les dernières actualités du club dans l’onglet « Actualités ». Tu peux voir les annonces importantes, les résultats des matchs et les informations du staff directement depuis le dashboard.",
        icon: 'fa-solid fa-newspaper' // icône modifiée pour refléter les actualités
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
    ]
  };

  features: Feature[] = []; // fonctionnalités à afficher selon rôle

  stats: Stat[] = [
    { label: 'Membres', value: 450, icon: 'fa-solid fa-users' },
    { label: 'Année de création', value: 1995, icon: 'fa-solid fa-calendar' },
    { label: 'Équipes actives', value: 12, icon: 'fa-solid fa-people-group' },
    { label: 'Catégories (U6,U7,U8..)', value: 8, icon: 'fa-solid fa-layer-group' },
  ];

  currentUser: any = null;

  ngOnInit() {
    const userData = localStorage.getItem('utilisateur');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        const role = this.currentUser.role || 'joueur';
        this.features = this.allFeatures[role] || this.allFeatures['joueur'];
      } catch (e) {
        console.error("Erreur parsing currentUser:", e);
        this.features = this.allFeatures['joueur'];
      }
    } else {
      this.features = this.allFeatures['joueur']; // si aucun utilisateur connecté
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
