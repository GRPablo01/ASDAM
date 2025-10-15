import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { JourC } from '../../../component/Coach/page-planning/jour-c/jour-c';
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";

@Component({
  selector: 'app-planning-s',
  imports: [HeaderS, JourC, FooterS],
  templateUrl: './planning-s.html',
  styleUrl: './planning-s.css'
})
export class PlanningS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Planning - SA ');
  }
}