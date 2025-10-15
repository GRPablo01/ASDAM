import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { ParamC } from '../../../component/Coach/page-param/param-c/param-c';

@Component({
  selector: 'app-parametre-j',
  imports: [HeaderJ,FooterJ,ParamC],
  templateUrl: './parametre-j.html',
  styleUrl: './parametre-j.css'
})
export class ParametreJ implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Settings - Joueur ');
  }
}
