import { Component } from '@angular/core';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { JourC } from '../../../component/Coach/page-planning/jour-c/jour-c';

@Component({
  selector: 'app-planning-s',
  imports: [HeaderS,JourC],
  templateUrl: './planning-s.html',
  styleUrl: './planning-s.css'
})
export class PlanningS {

}
