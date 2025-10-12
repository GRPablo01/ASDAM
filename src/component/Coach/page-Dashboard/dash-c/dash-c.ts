import { Component } from '@angular/core';
import { UserC } from "../user-c/user-c";
import { AccesRapideC } from "../acces-rapide-c/acces-rapide-c";
import { FooterC } from "../../footer-c/footer-c";
import { ListJoueur } from "../list-joueur/list-joueur";
import { MatchVueC } from '../../match-vue-c/match-vue-c';

@Component({
  selector: 'app-dash-c',
  imports: [UserC, AccesRapideC, FooterC, ListJoueur,MatchVueC],
  templateUrl: './dash-c.html',
  styleUrl: './dash-c.css'
})
export class DashC {

}
