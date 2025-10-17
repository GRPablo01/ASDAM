import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { EnteteC } from '../../../component/Coach/page-Accueil/entete-c/entete-c';

import { Sections2 } from "../../../component/Coach/page-Accueil/sections2/sections2";
import { Sections1C } from "../../../component/Coach/page-Accueil/sections1-c/sections1-c";
import { FooterC } from '../../../component/Coach/footer-c/footer-c';
import { Jour } from '../../../component/jour/jour';


@Component({
  selector: 'app-acceuil-c',
  imports: [HeaderC, EnteteC, Sections2, Sections1C,FooterC,Jour],
  templateUrl: './acceuil-c.html',
  styleUrl: './acceuil-c.css'
})
export class AcceuilC implements OnInit {
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Acceuil - Coach ');

    // Simuler un préchargement ou attendre les données nécessaires
    setTimeout(() => {
      this.isLoaded = true;
    }, 10); // tu peux remplacer par un vrai chargement de données
  }
}
