import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { ConvoqueA } from '../../../component/Admin/convoque-a/convoque-a';
import { FooterS } from "../../../component/Super-Admin/footer-s/footer-s";

@Component({
  selector: 'app-convocation-s',
  imports: [HeaderS, ConvoqueA, FooterS],
  templateUrl: './convocation-s.html',
  styleUrl: './convocation-s.css'
})
export class ConvocationS implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Convoque - SA ');
  }
}