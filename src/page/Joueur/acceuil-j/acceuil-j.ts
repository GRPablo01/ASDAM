import { Component } from '@angular/core';
import { BarreJ } from '../../../component/Joueur/barre-j/barre-j';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Sections2 } from "../../../component/Coach/page-Accueil/sections2/sections2";
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { Sections1 } from '../../../component/Joueur/page-Acceuil/sections1/sections1';
import { Section2J } from "../../../component/Joueur/page-Acceuil/section2-j/section2-j";


@Component({
  selector: 'app-acceuil-j',
  imports: [BarreJ, HttpClientModule, CommonModule, Sections1, FooterJ, Section2J],
  standalone: true,
  templateUrl: './acceuil-j.html',
  styleUrl: './acceuil-j.css'
})
export class AcceuilJ {

}
