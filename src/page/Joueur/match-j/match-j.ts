import { Component } from '@angular/core';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { MatchC2 } from '../../../component/Coach/match-c2/match-c2';

@Component({
  selector: 'app-match-j',
  imports: [HeaderJ,FooterJ,MatchC2],
  templateUrl: './match-j.html',
  styleUrl: './match-j.css'
})
export class MatchJ {

}
