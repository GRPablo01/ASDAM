import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from "../../../component/Super-Admin/header-s/header-s";
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";
import { Section1S } from "../../../component/Super-Admin/page-Acceuil/section1-s/section1-s";
import { Sections2 } from "../../../component/Coach/page-Accueil/sections2/sections2";

@Component({
  selector: 'app-acceuil-s',
  imports: [HeaderS, FooterS, Section1S, Sections2],
  templateUrl: './acceuil-s.html',
  styleUrl: './acceuil-s.css'
})
export class AcceuilS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Acceuil - SA ');
  }
}


