import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from "../../component/header/header";
import { Footer } from '../../component/footer/footer';
import { MMS } from "../../component/mms/mms";

@Component({
  selector: 'app-messages',
  imports: [CommonModule, Header, Footer, MMS],
  templateUrl: './messages.html',
  styleUrls: ['./messages.css']
})
export class Messages implements OnInit {
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