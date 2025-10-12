import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { Commun } from '../../../component/Coach/page-communiquer/commun/commun';

@Component({
  selector: 'app-communiquer-c',
  imports: [HeaderC, FooterC,Commun],
  templateUrl: './communiquer-c.html',
  styleUrl: './communiquer-c.css'
})
export class CommuniquerC {

}
