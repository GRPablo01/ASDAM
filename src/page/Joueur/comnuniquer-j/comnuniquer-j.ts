import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Commun } from "../../../component/Coach/page-communiquer/commun/commun";
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';

@Component({
  selector: 'app-comnuniquer-j',
  imports: [Commun, FooterJ,HeaderJ],
  templateUrl: './comnuniquer-j.html',
  styleUrl: './comnuniquer-j.css'
})
export class ComnuniquerJ implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Communiquer - Joueur ');
  }
}
