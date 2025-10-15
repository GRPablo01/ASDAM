import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { MatchC2 } from "../../../component/Coach/match-c2/match-c2";
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";

@Component({
  selector: 'app-match-s',
  imports: [HeaderS, MatchC2, FooterS],
  templateUrl: './match-s.html',
  styleUrl: './match-s.css'
})
export class MatchS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Match - SA ');
  }
}