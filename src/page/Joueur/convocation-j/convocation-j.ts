import { Component } from '@angular/core';
import { HeaderJ } from "../../../component/Joueur/header-j/header-j";
import { ConvoqueJ } from '../../../component/Joueur/page-Convocation/convoque-j/convoque-j';
import { FooterJ } from "../../../component/Joueur/footer-j/footer-j";

@Component({
  selector: 'app-convocation-j',
  imports: [HeaderJ, ConvoqueJ, FooterJ],
  templateUrl: './convocation-j.html',
  styleUrl: './convocation-j.css'
})
export class ConvocationJ {

}
