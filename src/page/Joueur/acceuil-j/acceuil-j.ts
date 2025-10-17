import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BarreJ } from '../../../component/Joueur/barre-j/barre-j';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Sections1 } from '../../../component/Joueur/page-Acceuil/sections1/sections1';
import { Section2J } from "../../../component/Joueur/page-Acceuil/section2-j/section2-j";
import { Jour } from "../../../component/jour/jour";
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';

@Component({
  selector: 'app-acceuil-j',
  imports: [ HttpClientModule, CommonModule, Sections1, Section2J, Jour, FooterJ],
  standalone: true,
  templateUrl: './acceuil-j.html',
  styleUrls: ['./acceuil-j.css']
})
export class AcceuilJ implements OnInit {
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('TEAM ASDAM | Acceuil - Joueur');

    // Simuler un préchargement ou attendre les données nécessaires
    setTimeout(() => {
      this.isLoaded = true;
    }, 10); // tu peux remplacer par un vrai chargement de données
  }
}
