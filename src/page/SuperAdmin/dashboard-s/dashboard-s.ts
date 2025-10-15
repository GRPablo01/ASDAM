import { Component } from '@angular/core';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { FooterS } from '../../../component/Super-Admin/footer-s/footer-s';
import { DashS } from "../../../component/Super-Admin/page-Dashboard/dash-s/dash-s";

@Component({
  selector: 'app-dashboard-s',
  imports: [HeaderS, FooterS, DashS],
  templateUrl: './dashboard-s.html',
  styleUrl: './dashboard-s.css'
})
export class DashboardS {

}
