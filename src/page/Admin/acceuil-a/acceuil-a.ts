import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Section1 } from "../../../component/Admin/page-Acceuil/section1/section1";
import { Sections2 } from "../../../component/Coach/page-Accueil/sections2/sections2";
import { FooterA } from "../../../component/Admin/footer-a/footer-a";

@Component({
  selector: 'app-acceuil-a',
  standalone: true, // 🔥 Important pour Angular standalone
  imports: [Section1, Sections2, FooterA],
  templateUrl: './acceuil-a.html',
  styleUrls: ['./acceuil-a.css'] // ✅ c’est "styleUrls" (avec un 's')
})
export class AcceuilA implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Accueil - Admin ');
  }
}
