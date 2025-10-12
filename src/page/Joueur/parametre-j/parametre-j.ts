import { Component } from '@angular/core';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { ParamC } from '../../../component/Coach/page-param/param-c/param-c';

@Component({
  selector: 'app-parametre-j',
  imports: [HeaderJ,FooterJ,ParamC],
  templateUrl: './parametre-j.html',
  styleUrl: './parametre-j.css'
})
export class ParametreJ {

}
