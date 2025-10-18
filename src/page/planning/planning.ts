import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from "../../component/header/header";
import { Footer } from '../../component/footer/footer';
import { CommonModule } from '@angular/common';
import { Jour } from '../../component/jour/jour';



@Component({
  selector: 'app-planning',
  imports: [Header, Footer, CommonModule, Jour],
  templateUrl: './planning.html',
  styleUrl: './planning.css'
})
export class Planning implements OnInit {
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
