import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { ActusC } from '../../../component/Coach/page-actualite/actus-c/actus-c';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualite-j',
  imports: [HeaderJ,FooterJ,ActusC,CommonModule],
  templateUrl: './actualite-j.html',
  styleUrl: './actualite-j.css'
})
export class ActualiteJ implements OnInit {
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Atus - Joueur ');
  // Simuler un préchargement ou attendre les données nécessaires
  setTimeout(() => {
    this.isLoaded = true;
  }, 10); // tu peux remplacer par un vrai chargement de données
}
}