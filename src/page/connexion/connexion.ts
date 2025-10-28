import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Login } from '../login/login';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,           // composant autonome
  imports: [Login,CommonModule],           // importe le composant login
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css']  // CORRECTION : styleUrls au pluriel
})
export class Connexion implements OnInit {
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Connexion');

    // Simuler un préchargement ou attendre les données nécessaires
    setTimeout(() => {
      this.isLoaded = true;
    }, 10); // tu peux remplacer par un vrai chargement de données
  }
}