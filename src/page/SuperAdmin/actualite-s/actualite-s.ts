import { Component } from '@angular/core';
import { HeaderS } from "../../../component/Super-Admin/header-s/header-s";
import { ActusC } from "../../../component/Coach/page-actualite/actus-c/actus-c";

@Component({
  selector: 'app-actualite-s',
  imports: [HeaderS, ActusC],
  templateUrl: './actualite-s.html',
  styleUrl: './actualite-s.css'
})
export class ActualiteS {

}
