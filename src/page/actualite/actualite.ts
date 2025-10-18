import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from "../../component/header/header";
import { Footer } from "../../component/footer/footer";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Actus } from "../../component/actus/actus";

@Component({
  selector: 'app-actualite',
  standalone: true, // <-- ajouter si tu veux que ce composant soit standalone
  imports: [Header, Footer, Actus, CommonModule, FormsModule],
  templateUrl: './actualite.html',
  styleUrls: ['./actualite.css'] // <-- corriger l'orthographe
})
export class Actualite implements OnInit {
  isLoaded: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Accueil');

    // Simuler un préchargement
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }
}
