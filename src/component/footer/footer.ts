import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faShieldHalved, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {
  currentYear: number = new Date().getFullYear();
  isDarkMode = false; // ✅ ajouter
  navLinks: { path: string, label: string }[] = [];
  ressources: { path: string, label: string }[] = [];

  socialIcons = [
    { name: 'Facebook', url: 'https://facebook.com', icon: faFacebookF },
    { name: 'Instagram', url: 'https://instagram.com', icon: faInstagram },
    { name: 'Twitter', url: 'https://twitter.com', icon: faTwitter }
  ];

  faShieldHalved = faShieldHalved;
  faArrowRight = faArrowRight;

  user = {
    nom: '',
    prenom: '',
    role: ''
  };

  // Définir les liens par rôle
  private navByRole: { [role: string]: { navLinks: any[], ressources: any[] } } = {
    'super admin': {
      navLinks: [
        { path: '/communiques', label: 'Communiqués' },
        { path: '/utilisateur', label: 'Utilisateur' },
        { path: '/classement', label: 'Classement' },
        { path: '/messages', label: 'Messages' },
        { path: '/dashboard', label: 'Dashboard' }
      ],
      ressources: []
    },
    admin: {
      navLinks: [
        { path: '/communiques', label: 'Communiqués' },
        { path: '/utilisateur', label: 'Utilisateur' },
        { path: '/classement', label: 'Classement' },
        { path: '/messages', label: 'Messages' },
        { path: '/dashboard', label: 'Dashboard' }
      ],
      ressources: []
    },
    coach: {
      navLinks: [
        { path: '/communiques', label: 'Communiqués' },
        { path: '/convocations', label: 'Convocations' },
        { path: '/classement', label: 'Classement' },
        { path: '/messages', label: 'Messages' },
        { path: '/dashboard', label: 'Dashboard' }
      ],
      ressources: []
    },
    joueur: {
      navLinks: [
        { path: '/actualite', label: 'Actualités' },
        { path: '/communiques', label: 'Communiqués' },
        { path: 'convocations', label: 'Mes Convocations' },
        { path: '/classement', label: 'Classement' },
        { path: '/messages', label: 'Messages'},
        { path: '/dashboard', label: 'Dashboard' }
      ],
      ressources: []
    },
    invité: {
      navLinks: [
        { path: '/actualite', label: 'Actualités' },
        { path: '/communiques', label: 'Communiqués' },
        { path: '/classement', label: 'Classement' },
        { path: '/messages', label: 'Messages'},
        { path: '/dashboard', label: 'Dashboard' }
      ],
      ressources: []
    }
  };

  constructor() {
    // Charger l'utilisateur
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      this.user.nom = userObj.nom || '';
      this.user.prenom = userObj.prenom || '';
      this.user.role = userObj.role || 'joueur';

      const roleLinks = this.navByRole[this.user.role] || this.navByRole['joueur'];
      this.navLinks = roleLinks.navLinks;
      this.ressources = roleLinks.ressources;
    } else {
      const roleLinks = this.navByRole['joueur'];
      this.navLinks = roleLinks.navLinks;
      this.ressources = roleLinks.ressources;
    }

    // Charger le thème
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
