import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from "../../../component/Super-Admin/header-s/header-s";
import { ActusC } from "../../../component/Coach/page-actualite/actus-c/actus-c";
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";

@Component({
  selector: 'app-actualite-s',
  imports: [HeaderS, ActusC, FooterS],
  templateUrl: './actualite-s.html',
  styleUrl: './actualite-s.css'
})
export class ActualiteS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Actus - SA ');
  }
}