import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from "../../component/header/header";
import { Footer } from '../../component/footer/footer';
import { Class } from '../../component/class/class';


@Component({
  selector: 'app-classement',
  imports: [CommonModule, Header, Footer, Class],
  templateUrl: './classement.html',
  styleUrl: './classement.css'
})
export class Classement implements OnInit {
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