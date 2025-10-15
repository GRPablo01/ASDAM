import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faShieldHalved, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer-s',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './footer-s.html',
  styleUrls: ['./footer-s.css']
})
export class FooterS {
  currentYear: number = new Date().getFullYear();

  navLinks = [
    { path: '/actualiteS/communiquesS', label: 'Communiqués' },
    { path: '/matchS/convocationsS', label: 'Convocation' },
    { path: '/matchS/resultatsS', label: 'Résultats' },
    { path: '/messagS', label: 'Message' }
  ];

  ressources = [
    { path: '/dashboardS/profileS', label: 'Profil' },
    { path: '/dashboardS/settingsS', label: 'Paramètres' },
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
