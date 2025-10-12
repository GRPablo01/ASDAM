import { Component } from '@angular/core';
import { HeaderC } from '../../../component/Coach/header-c/header-c';
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { DashC } from '../../../component/Coach/page-Dashboard/dash-c/dash-c';


@Component({
  selector: 'app-dashboard-c',
  imports: [HeaderC, DashC, FooterC],
  templateUrl: './dashboard-c.html',
  styleUrl: './dashboard-c.css'
})
export class DashboardC {

}
