import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderJ } from "../../../component/Joueur/header-j/header-j";
import { AbsentC } from "../../../component/Coach/page-Absents/absent-c/absent-c";
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";

@Component({
  selector: 'app-absents-j',
  imports: [HeaderJ, AbsentC, FooterJ],
  templateUrl: './absents-j.html',
  styleUrl: './absents-j.css'
})
export class AbsentsJ implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Absents - Joueur ');
  }
}
