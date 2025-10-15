import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { ProfilUser } from '../../../component/Coach/page-Profil/profil-user/profil-user';

@Component({
  selector: 'app-profil-j',
  imports: [HeaderJ,FooterJ,ProfilUser],
  templateUrl: './profil-j.html',
  styleUrl: './profil-j.css'
})
export class ProfilJ implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Profil - Joueur ');
  }
}
