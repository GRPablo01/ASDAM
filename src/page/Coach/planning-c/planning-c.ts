import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { JourC } from '../../../component/Coach/page-planning/jour-c/jour-c';
import { FooterC } from "../../../component/Coach/footer-c/footer-c";



@Component({
  selector: 'app-planning-c',
  standalone:true,
  imports: [HeaderC, JourC, FooterC],
  templateUrl: './planning-c.html',
  styleUrl: './planning-c.css'
})
export class PlanningC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Planning - Coach ');
  }
}
