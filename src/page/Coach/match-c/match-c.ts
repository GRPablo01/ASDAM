import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { MatchC2 } from '../../../component/Coach/match-c2/match-c2';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';

@Component({
  selector: 'app-match-c',
  imports: [HeaderC,MatchC2,FooterJ],
  templateUrl: './match-c.html',
  styleUrl: './match-c.css'
})
export class MatchC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Match - Coach ');
  }
}
