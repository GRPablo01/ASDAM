import { Component } from '@angular/core';
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { ActusC } from "../../../component/Coach/page-actualite/actus-c/actus-c";
import { FooterA} from "../../../component/Admin/footer-a/footer-a";

@Component({
  selector: 'app-actualite-a',
  imports: [HeaderA, ActusC, FooterA],
  templateUrl: './actualite-a.html',
  styleUrl: './actualite-a.css'
})
export class ActualiteA {

}
