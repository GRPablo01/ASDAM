import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from '../../../component/Coach/header-c/header-c';
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { DashC } from '../../../component/Coach/page-Dashboard/dash-c/dash-c';


@Component({
  selector: 'app-dashboard-c',
  imports: [HeaderC, DashC, FooterC],
  templateUrl: './dashboard-c.html',
  styleUrl: './dashboard-c.css'
})
export class DashboardC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Dash - Coach ');
  }
}
