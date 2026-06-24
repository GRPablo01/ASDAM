import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


import { Icon } from '../../icon/icon';
import { Header } from '../../../Public/header/header';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

import { Icon3 } from "../../../Public/icon3/icon3";







interface Utilisateur {
  nom?: string;
  prenom?: string;
  role?: string;
}



@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, Icon, Header, Icon3],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome{

  constructor(
    public themeService: ThemeService
  ) {}

  // ================= USER =================
  utilisateur: Utilisateur | null = null;
  isLoggedIn = false;
  userRole: string = 'inviter';

  // UI
  hoverBtn = false;
  hoverBtnLeft = false;
  hoverBtnRight = false;

  currentTime = '';
  isMobile = false;

  iconMatchHover = false;
  iconExploreHover = false;

  // ================= MATCH =================
  // matchs: MatchUI[] = [];
  totalMatches = 0;
  currentMatch = 0;

  isAutoplay = false;
  autoplayInterval: any;
  compteReboursInterval: any;

  // USER INFO
  nom = '';
  prenom = '';
  initiales = '';
  role = '';

  // ================= INIT =================
  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();
  }

  // ================= MOBILE =================
  detectMobile(): void {
    this.isMobile = window.innerWidth < 768;

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  // ================= USER =================
  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (!storedUser) {
      this.role = 'inviter';
      return;
    }

    try {
      this.utilisateur = JSON.parse(storedUser);
      this.isLoggedIn = true;

      this.nom = this.utilisateur?.nom || '';
      this.prenom = this.utilisateur?.prenom || '';
      this.role = this.utilisateur?.role || 'inviter';
      this.userRole = this.role;

      this.initiales = this.getInitiales(this.nom, this.prenom);

    } catch (error) {
      console.error('❌ Erreur parsing utilisateur :', error);
      this.utilisateur = null;
      this.isLoggedIn = false;
      this.role = 'inviter';
    }
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

}