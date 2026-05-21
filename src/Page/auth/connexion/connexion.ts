import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Login } from '../../../Composant/auth/login/login';
import { Mobile } from '../../../Composant/Share/mobile/mobile';


@Component({
  selector: 'app-connexion',
  imports: [Login, CommonModule, Mobile],
  standalone:true,
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {


  // ✅ Variable pour simuler le chargement
  isLoaded: boolean = false;

  constructor(
    private titleService: Title,
  ) {}

  ngOnInit(): void {

    // 🧠 Titre onglet
    this.titleService.setTitle('ASDAM | Connexion');

    // ⏳ Petit effet de chargement
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

}
