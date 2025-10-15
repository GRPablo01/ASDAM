import { Component } from '@angular/core';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { MatchC2 } from "../../../component/Coach/match-c2/match-c2";

@Component({
  selector: 'app-match-s',
  imports: [HeaderS, MatchC2],
  templateUrl: './match-s.html',
  styleUrl: './match-s.css'
})
export class MatchS {

}
