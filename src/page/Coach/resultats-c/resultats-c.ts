import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { Classement } from '../../../component/classement/classement';

@Component({
  selector: 'app-resultats-c',
  imports: [HeaderC, FooterC,Classement],
  templateUrl: './resultats-c.html',
  styleUrl: './resultats-c.css'
})
export class ResultatsC {

}
