import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { ActusC } from "../../../component/Coach/page-actualite/actus-c/actus-c";
import { FooterA} from "../../../component/Admin/footer-a/footer-a";

@Component({
  selector: 'app-actualite-a',
  imports: [HeaderA, ActusC, FooterA],
  templateUrl: './actualite-a.html',
  styleUrl: './actualite-a.css'
})
export class ActualiteA implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Actus - Admin ');
  }
}

