import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Commun } from "../../../component/Coach/page-communiquer/commun/commun";
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comnuniquer-j',
  imports: [Commun, FooterJ,HeaderJ,CommonModule],
  templateUrl: './comnuniquer-j.html',
  styleUrl: './comnuniquer-j.css'
})
export class ComnuniquerJ implements OnInit {
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Communiquer - Joueur ');
  // Simuler un préchargement ou attendre les données nécessaires
  setTimeout(() => {
    this.isLoaded = true;
  }, 10); // tu peux remplacer par un vrai chargement de données
}
}