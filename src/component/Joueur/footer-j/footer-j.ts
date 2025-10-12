import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faShieldHalved, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer-j',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './footer-j.html',
  styleUrls: ['./footer-j.css']
})
export class FooterJ {
  currentYear: number = new Date().getFullYear();

  navLinks = [
    { path: '/actualiteJ/communiquesJ', label: 'Communiqués' },
    { path: '/matchJ/convocationsJ', label: 'Convocation' },
    { path: '/matchJ/resultatsJ', label: 'Résultats' },
    { path: '/messagJ', label: 'Message' }
  ];

  ressources = [
    { path: '/dashboardJ/profileJ', label: 'Profil' },
    { path: '/dashboardJ/settingsJ', label: 'Paramètres' },
  ];

  socialIcons = [
    { name: 'Facebook', url: 'https://facebook.com', icon: faFacebookF },
    { name: 'Instagram', url: 'https://instagram.com', icon: faInstagram },
    { name: 'Twitter', url: 'https://twitter.com', icon: faTwitter }
  ];

  faShieldHalved = faShieldHalved;
  faArrowRight = faArrowRight;

  user = {
    nom: '',
    prenom: ''
  };

  constructor() {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      this.user.nom = userObj.nom || '';
      this.user.prenom = userObj.prenom || '';
    }
  }
}
