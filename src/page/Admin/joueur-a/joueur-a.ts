import { Component } from '@angular/core';
import { HeaderA } from "../../../component/Admin/header-a/header-a";
import { FooterA } from "../../../component/Admin/footer-a/footer-a";
import { PlayerA } from '../../../component/Admin/player-a/player-a';

@Component({
  selector: 'app-joueur-a',
  imports: [HeaderA, FooterA,PlayerA],
  templateUrl: './joueur-a.html',
  styleUrl: './joueur-a.css'
})
export class JoueurA {

}
