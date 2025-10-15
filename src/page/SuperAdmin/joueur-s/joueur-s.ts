import { Component } from '@angular/core';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { PlayerA } from "../../../component/Admin/player-a/player-a";

@Component({
  selector: 'app-joueur-s',
  imports: [HeaderS, PlayerA],
  templateUrl: './joueur-s.html',
  styleUrl: './joueur-s.css'
})
export class JoueurS {

}
