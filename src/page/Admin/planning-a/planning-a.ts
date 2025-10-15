import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { FooterA } from '../../../component/Admin/footer-a/footer-a';
import { JourC } from '../../../component/Coach/page-planning/jour-c/jour-c';

@Component({
  selector: 'app-planning-a',
  imports: [HeaderA, FooterA,JourC],
  templateUrl: './planning-a.html',
  styleUrl: './planning-a.css'
})
export class PlanningA implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Planning - Admin ');
  }
}

