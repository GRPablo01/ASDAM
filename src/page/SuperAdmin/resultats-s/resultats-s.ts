import { Component } from '@angular/core';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { Classement } from "../../../component/classement/classement";

@Component({
  selector: 'app-resultats-s',
  imports: [HeaderS, Classement],
  templateUrl: './resultats-s.html',
  styleUrl: './resultats-s.css'
})
export class ResultatsS {

}
