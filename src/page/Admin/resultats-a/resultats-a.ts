import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { FooterA } from '../../../component/Admin/footer-a/footer-a';
import { Classement } from '../../../component/classement/classement';

@Component({
  selector: 'app-resultats-a',
  imports: [HeaderA,FooterA,Classement],
  templateUrl: './resultats-a.html',
  styleUrl: './resultats-a.css'
})
export class ResultatsA implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Accueil - Admin ');
  }
}

