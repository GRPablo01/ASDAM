import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { MatchC2 } from '../../../component/Coach/match-c2/match-c2';

@Component({
  selector: 'app-match-j',
  imports: [HeaderJ,FooterJ,MatchC2],
  templateUrl: './match-j.html',
  styleUrl: './match-j.css'
})
export class MatchJ implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Match - Joueur ');
  }
}
