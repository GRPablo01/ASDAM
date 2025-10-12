import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { ActusC } from '../../../component/Coach/page-actualite/actus-c/actus-c';
import { FooterC } from "../../../component/Coach/footer-c/footer-c";

@Component({
  selector: 'app-actualite-c',
  imports: [ActusC, HeaderC, FooterC],
  templateUrl: './actualite-c.html',
  styleUrl: './actualite-c.css'
})
export class ActualiteC {
}
