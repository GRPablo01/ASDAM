import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { ActusC } from '../../../component/Coach/page-actualite/actus-c/actus-c';
import { FooterC } from "../../../component/Coach/footer-c/footer-c";

@Component({
  selector: 'app-actualite-c',
  imports: [ActusC, HeaderC, FooterC],
  templateUrl: './actualite-c.html',
  styleUrl: './actualite-c.css'
})
export class ActualiteC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Actus - Coach ');
  }
}
