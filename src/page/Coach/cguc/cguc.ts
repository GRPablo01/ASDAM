import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { CGU2C } from '../../../component/Coach/page-CGU/cgu2-c/cgu2-c';

@Component({
  selector: 'app-cguc',
  imports: [CGU2C],
  templateUrl: './cguc.html',
  styleUrl: './cguc.css'
})
export class CGUC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | CGU');
  }
}
