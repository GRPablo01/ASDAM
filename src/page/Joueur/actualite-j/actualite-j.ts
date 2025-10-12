import { Component } from '@angular/core';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { ActusC } from '../../../component/Coach/page-actualite/actus-c/actus-c';

@Component({
  selector: 'app-actualite-j',
  imports: [HeaderJ,FooterJ,ActusC],
  templateUrl: './actualite-j.html',
  styleUrl: './actualite-j.css'
})
export class ActualiteJ {

}
