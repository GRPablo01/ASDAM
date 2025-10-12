import { Component } from '@angular/core';
import { Commun } from "../../../component/Coach/page-communiquer/commun/commun";
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';

@Component({
  selector: 'app-comnuniquer-j',
  imports: [Commun, FooterJ,HeaderJ],
  templateUrl: './comnuniquer-j.html',
  styleUrl: './comnuniquer-j.css'
})
export class ComnuniquerJ {

}
