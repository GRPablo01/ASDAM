import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { Commun } from "../../../component/Coach/page-communiquer/commun/commun";
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";

@Component({
  selector: 'app-communiquer-s',
  imports: [HeaderS, Commun, FooterS],
  templateUrl: './communiquer-s.html',
  styleUrl: './communiquer-s.css'
})
export class CommuniquerS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Communiquer - SA ');
  }
}