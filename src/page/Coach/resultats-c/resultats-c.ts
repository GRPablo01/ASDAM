import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { Classement } from '../../../component/classement/classement';

@Component({
  selector: 'app-resultats-c',
  imports: [HeaderC, FooterC,Classement],
  templateUrl: './resultats-c.html',
  styleUrl: './resultats-c.css'
})
export class ResultatsC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Résultats - Coach ');
  }
}

