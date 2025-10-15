import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderA } from "../../../component/Admin/header-a/header-a";
import { FooterA } from "../../../component/Admin/footer-a/footer-a";
import { PlayerA } from '../../../component/Admin/player-a/player-a';

@Component({
  selector: 'app-joueur-a',
  imports: [HeaderA, FooterA,PlayerA],
  templateUrl: './joueur-a.html',
  styleUrl: './joueur-a.css'
})
export class JoueurA implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Joueur - Admin ');
  }
}

