import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { PlayerA } from "../../../component/Admin/player-a/player-a";
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";

@Component({
  selector: 'app-joueur-s',
  imports: [HeaderS, PlayerA, FooterS],
  templateUrl: './joueur-s.html',
  styleUrl: './joueur-s.css'
})
export class JoueurS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Joueur - SA ');
  }
}