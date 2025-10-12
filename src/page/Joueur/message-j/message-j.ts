import { Component } from '@angular/core';
import { HeaderJ } from '../../../component/Joueur/header-j/header-j';
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";
import { MMSC } from '../../../component/Coach/page-message/mmsc/mmsc';

@Component({
  selector: 'app-message-j',
  imports: [HeaderJ, MMSC, FooterJ],
  templateUrl: './message-j.html',
  styleUrl: './message-j.css'
})
export class MessageJ {

}
