import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from "../../component/header/header";
import { Sections1C } from "../../component/section/section";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sections2 } from '../../component/section2/section2';
import { Footer } from "../../component/footer/footer";
import { Jour } from "../../component/jour2/jour2";

@Component({
  selector: 'app-accueil',
  imports: [Header, Sections2, Sections1C, CommonModule, FormsModule, Footer, Jour],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil implements OnInit {
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Acceuil');

    // Simuler un préchargement ou attendre les données nécessaires
    setTimeout(() => {
      this.isLoaded = true;
    }, 10); // tu peux remplacer par un vrai chargement de données
  }
}