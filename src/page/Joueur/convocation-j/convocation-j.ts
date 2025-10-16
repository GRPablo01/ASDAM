import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderJ } from "../../../component/Joueur/header-j/header-j";
import { ConvoqueJ } from '../../../component/Joueur/page-Convocation/convoque-j/convoque-j';
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";

@Component({
  selector: 'app-convocation-j',
  imports: [HeaderJ, ConvoqueJ, FooterJ],
  templateUrl: './convocation-j.html',
  styleUrl: './convocation-j.css'
})
export class ConvocationJ implements OnInit {
  isLoaded: boolean = false;


  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Convoque - Joueur ');
  // Simuler un préchargement ou attendre les données nécessaires
  setTimeout(() => {
    this.isLoaded = true;
  }, 10); // tu peux remplacer par un vrai chargement de données
}
}
