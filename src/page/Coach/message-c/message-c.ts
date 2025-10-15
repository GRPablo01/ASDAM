import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { MMSC } from '../../../component/Coach/page-message/mmsc/mmsc';
import { FooterC } from "../../../component/Coach/footer-c/footer-c";


@Component({
  selector: 'app-message-c',
  imports: [HeaderC, MMSC, FooterC],
  templateUrl: './message-c.html',
  styleUrl: './message-c.css'
})
export class MessageC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Message - Coach ');
  }
}
