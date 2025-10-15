import { Component } from '@angular/core';
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { FooterA } from '../../../component/Admin/footer-a/footer-a';
import { JourC } from '../../../component/Coach/page-planning/jour-c/jour-c';

@Component({
  selector: 'app-planning-a',
  imports: [HeaderA, FooterA,JourC],
  templateUrl: './planning-a.html',
  styleUrl: './planning-a.css'
})
export class PlanningA {

}
