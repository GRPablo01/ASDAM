import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { JourC } from '../../../component/Coach/page-planning/jour-c/jour-c';
import { FooterC } from "../../../component/Coach/footer-c/footer-c";



@Component({
  selector: 'app-planning-c',
  standalone:true,
  imports: [HeaderC, JourC, FooterC],
  templateUrl: './planning-c.html',
  styleUrl: './planning-c.css'
})
export class PlanningC {

}
