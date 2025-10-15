import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { Classement } from "../../../component/classement/classement";
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";

@Component({
  selector: 'app-resultats-s',
  imports: [HeaderS, Classement, FooterS],
  templateUrl: './resultats-s.html',
  styleUrl: './resultats-s.css'
})
export class ResultatsS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Résultat - SA ');
  }
}