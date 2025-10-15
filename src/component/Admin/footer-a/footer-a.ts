import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faShieldHalved, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer-a',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './footer-a.html',
  styleUrls: ['./footer-a.css']
})
export class FooterA {
  currentYear: number = new Date().getFullYear();

  navLinks = [
    { path: '/actualiteC/communiquesC', label: 'Communiqués' },
    { path: '/matchC/convocationsC', label: 'Convocation' },
    { path: '/matchC/resultatsC', label: 'Résultats' },
    { path: '/messagC', label: 'Message' }
  ];

  ressources = [
    { path: '/dashboardC/profileC', label: 'Profil' },
    { path: '/dashboardC/settingsC', label: 'Paramètres' },
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
