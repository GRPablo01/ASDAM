import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from "../../component/header/header";
import { CommonModule } from '@angular/common';
import { Footer } from '../../component/footer/footer';
import { Player } from "../../component/player/player";

@Component({
  selector: 'app-utilisateur',
  imports: [Header, CommonModule, Footer, Player],
  templateUrl: './utilisateur.html',
  styleUrls: ['./utilisateur.css']
})
export class Utilisateur implements OnInit {
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