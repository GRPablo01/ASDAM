import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { FooterA } from '../../../component/Admin/footer-a/footer-a';
import { ConvoqueA } from '../../../component/Admin/convoque-a/convoque-a';

@Component({
  selector: 'app-convocation-a',
  imports: [HeaderA,FooterA,ConvoqueA],
  templateUrl: './convocation-a.html',
  styleUrl: './convocation-a.css'
})
export class ConvocationA implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Convoque - Admin ');
  }
}
