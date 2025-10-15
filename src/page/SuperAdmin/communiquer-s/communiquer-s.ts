import { Component } from '@angular/core';
import { HeaderS } from '../../../component/Super-Admin/header-s/header-s';
import { Commun } from "../../../component/Coach/page-communiquer/commun/commun";

@Component({
  selector: 'app-communiquer-s',
  imports: [HeaderS, Commun],
  templateUrl: './communiquer-s.html',
  styleUrl: './communiquer-s.css'
})
export class CommuniquerS {

}
