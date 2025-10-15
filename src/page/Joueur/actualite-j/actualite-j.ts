import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { ActusC } from '../../../component/Coach/page-actualite/actus-c/actus-c';

@Component({
  selector: 'app-actualite-j',
  imports: [HeaderJ,FooterJ,ActusC],
  templateUrl: './actualite-j.html',
  styleUrl: './actualite-j.css'
})
export class ActualiteJ implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Atus - Joueur ');
  }
}
