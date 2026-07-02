import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../Composant/Public/header/header';
import { Mobile } from '../../../Composant/Share/mobile/mobile';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Footer } from "../../../Composant/Public/footer/footer";
import { Match } from '../../../Composant/Share/Page-Match/match/match';
import { GetMatch } from '../../../Composant/Share/Page-MesMatch/get-match/get-match';






@Component({
  selector: 'app-mes-match',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Header,
    FormsModule,
    Mobile,
    Footer,
    GetMatch
],
  templateUrl: './mes-match.html',
  styleUrls: ['./mes-match.css'],
})
export class MesMatch implements OnInit {

  isLoaded: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private titleService: Title,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // 🧠 Titre de la page
    this.titleService.setTitle('ASDAM | Accueil');

    // 👤 Vérification de la connexion utilisateur
    const utilisateurString = localStorage.getItem('utilisateur');
    if (utilisateurString) this.isLoggedIn = true;

    // 🎨 Appliquer le thème depuis le ThemeService (lecture localStorage)
    this.themeService.applyTheme(this.themeService.isDarkMode);

    // 🎯 Initialisation de la scrollbar
    this.initScrollbar();

    // ⏳ Loader
    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  }

  /**
   * 🎯 Initialise la scrollbar dynamique et écoute les changements de thème
   */
  private initScrollbar(): void {
    // Couleurs initiales
    this.updateScrollbarColors(this.themeService.isDarkMode);

    // Abonnement aux changements de thème
    this.themeService.themeChange$.subscribe(isDark => {
      this.updateScrollbarColors(isDark);
    });
  }

  /**
   * 🎨 Met à jour les couleurs de la scrollbar
   */
  private updateScrollbarColors(isDark: boolean): void {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--scroll-track', '#1E1E1E');
      root.style.setProperty('--scroll-thumb', '#C1121F');
      root.style.setProperty('--scroll-thumb-hover', '#FF4D4D');
    } else {
      root.style.setProperty('--scroll-track', '#FFFFFF');
      root.style.setProperty('--scroll-thumb', '#C1121F');
      root.style.setProperty('--scroll-thumb-hover', '#E5383B');
    }
  }
}