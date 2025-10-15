import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatchC2 } from "../../../component/Coach/match-c2/match-c2";
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { FooterA} from "../../../component/Admin/footer-a/footer-a";

@Component({
  selector: 'app-match-a',
  imports: [MatchC2, HeaderA, FooterA],
  templateUrl: './match-a.html',
  styleUrl: './match-a.css'
})
export class MatchA implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Match - Admin ');
  }
}
