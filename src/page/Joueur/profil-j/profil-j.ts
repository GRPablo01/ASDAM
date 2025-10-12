import { Component } from '@angular/core';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from '../../../component/Joueur/footer-j/footer-j';
import { ProfilUser } from '../../../component/Coach/page-Profil/profil-user/profil-user';

@Component({
  selector: 'app-profil-j',
  imports: [HeaderJ,FooterJ,ProfilUser],
  templateUrl: './profil-j.html',
  styleUrl: './profil-j.css'
})
export class ProfilJ {

}
