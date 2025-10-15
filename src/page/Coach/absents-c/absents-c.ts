import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { AbsentC } from "../../../component/Coach/page-Absents/absent-c/absent-c";

@Component({
  selector: 'app-absents-c',
  imports: [HeaderC,AbsentC],
  templateUrl: './absents-c.html',
  styleUrl: './absents-c.css'
})
export class AbsentsC implements OnInit {

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    // ✅ Titre dynamique
    this.titleService.setTitle('TEAM ASDAM | Absents - Coach ');
  }
}
