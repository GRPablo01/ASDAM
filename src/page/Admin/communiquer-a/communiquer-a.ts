import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderA } from "../../../component/Admin/header-a/header-a";
import { Commun } from "../../../component/Coach/page-communiquer/commun/commun";
import { FooterA } from "../../../component/Admin/footer-a/footer-a";

@Component({
  selector: 'app-communiquer-a',
  imports: [HeaderA, Commun, FooterA],
  templateUrl: './communiquer-a.html',
  styleUrl: './communiquer-a.css'
})
export class CommuniquerA implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Commnuniquer - Admin ');
  }
}
