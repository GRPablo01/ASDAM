import { Component } from '@angular/core';
import { Section1 } from "../../../component/Admin/page-Acceuil/section1/section1";
import { Sections2 } from "../../../component/Coach/page-Accueil/sections2/sections2";
import { FooterA } from "../../../component/Admin/footer-a/footer-a";

@Component({
  selector: 'app-acceuil-a',
  imports: [Section1, Sections2, FooterA],
  templateUrl: './acceuil-a.html',
  styleUrl: './acceuil-a.css'
})
export class AcceuilA {

}
