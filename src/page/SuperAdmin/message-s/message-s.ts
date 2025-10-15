import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { MMSC } from '../../../component/Coach/page-message/mmsc/mmsc';
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";

@Component({
  selector: 'app-message-s',
  imports: [HeaderS, MMSC, FooterS],
  templateUrl: './message-s.html',
  styleUrl: './message-s.css'
})
export class MessageS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Message - SA ');
  }
}