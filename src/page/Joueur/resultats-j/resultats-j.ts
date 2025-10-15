import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { Classement } from '../../../component/classement/classement';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';

@Component({
  selector: 'app-resultats-j',
  imports: [HeaderJ,Classement,FooterJ],
  templateUrl: './resultats-j.html',
  styleUrl: './resultats-j.css'
})
export class ResultatsJ implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Résultat - Joueur ');
  }
}
