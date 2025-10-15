import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { DashC } from '../../../component/Coach/page-Dashboard/dash-c/dash-c';

@Component({
  selector: 'app-dashboard-j',
  imports: [FooterJ,HeaderJ,DashC],
  templateUrl: './dashboard-j.html',
  styleUrl: './dashboard-j.css'
})
export class DashboardJ implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Dash - Joueur ');
  }
}
