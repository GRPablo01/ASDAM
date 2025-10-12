import { Component } from '@angular/core';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { Classement } from '../../../component/classement/classement';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';

@Component({
  selector: 'app-resultats-j',
  imports: [HeaderJ,Classement,FooterJ],
  templateUrl: './resultats-j.html',
  styleUrl: './resultats-j.css'
})
export class ResultatsJ {

}
