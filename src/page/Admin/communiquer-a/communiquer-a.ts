import { Component } from '@angular/core';
import { HeaderA } from "../../../component/Admin/header-a/header-a";
import { Commun } from "../../../component/Coach/page-communiquer/commun/commun";
import { FooterA } from "../../../component/Admin/footer-a/footer-a";

@Component({
  selector: 'app-communiquer-a',
  imports: [HeaderA, Commun, FooterA],
  templateUrl: './communiquer-a.html',
  styleUrl: './communiquer-a.css'
})
export class CommuniquerA {

}
