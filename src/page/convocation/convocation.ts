import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Header } from '../../component/header/header';
import { Footer } from '../../component/footer/footer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Convoque } from '../../component/convoque-j/convoque-j';


@Component({
  selector: 'app-convocation',
  standalone: true,
  imports: [Header, Footer, CommonModule, FormsModule,Convoque],
  templateUrl: './convocation.html',
  styleUrl: './convocation.css'
})
export class Convocation implements OnInit {
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
