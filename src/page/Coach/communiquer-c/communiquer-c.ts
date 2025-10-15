import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { Commun } from '../../../component/Coach/page-communiquer/commun/commun';

@Component({
  selector: 'app-communiquer-c',
  imports: [HeaderC, FooterC,Commun],
  templateUrl: './communiquer-c.html',
  styleUrl: './communiquer-c.css'
})
export class CommuniquerC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Communiquer - Coach ');
  }
}
