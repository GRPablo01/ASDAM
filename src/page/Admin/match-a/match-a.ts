import { Component } from '@angular/core';
import { MatchC2 } from "../../../component/Coach/match-c2/match-c2";
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { FooterA} from "../../../component/Admin/footer-a/footer-a";

@Component({
  selector: 'app-match-a',
  imports: [MatchC2, HeaderA, FooterA],
  templateUrl: './match-a.html',
  styleUrl: './match-a.css'
})
export class MatchA {

}
