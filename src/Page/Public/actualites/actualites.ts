import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../Composant/Public/header/header';
import { Mobile } from '../../../Composant/Share/mobile/mobile';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Cookie } from '../../../Composant/Public/cookie/cookie';
import { Welcome } from '../../../Composant/Share/Page-Accueil/welcome/welcome';
import { ProchainMatch } from '../../../Composant/Share/Page-Accueil/prochain-match/prochain-match';
import { Fonctionalite } from "../../../Composant/Share/Page-Accueil/fonctionalite/fonctionalite";
import { Plannig2 } from "../../../Composant/Share/Page-Accueil/plannig2/plannig2";
import { Footer } from "../../../Composant/Public/footer/footer";
import { TestColor } from '../../../Composant/test-color/test-color';
import { Actus } from '../../../Composant/Share/Page-Actualites/actus/actus';




@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Header,
    FormsModule,
    Mobile,
    Footer,
    Actus
  
],
  templateUrl: './actualites.html',
  styleUrls: ['./actualites.css'],
})
export class Actualites implements OnInit {

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
      root.style.setProperty('--scroll-track', '#0B1220');
      root.style.setProperty('--scroll-thumb', '#C1121F');
      root.style.setProperty('--scroll-thumb-hover', '#FF4D4D');
    } else {
      root.style.setProperty('--scroll-track', '#F8FAFC');
      root.style.setProperty('--scroll-thumb', '#C1121F');
      root.style.setProperty('--scroll-thumb-hover', '#E5383B');
    }
  }
}